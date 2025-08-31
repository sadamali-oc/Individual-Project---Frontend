import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserProfileComponent implements OnInit {
  frm!: FormGroup;
  userId: string | null = null;
  universityClubs: { value: number; display: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  get f() {
    return this.frm.controls;
  }

  get userClubsArray(): FormArray {
    return this.frm.get('userClubs') as FormArray;
  }

  ngOnInit(): void {
    // Initialize form
    this.frm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      role: ['', Validators.required],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      universityClub: [''], // single organizer club
      userClubs: this.fb.array([]), // multi-select clubs for normal users
    });

    // Load clubs from backend
    this.http.get<any[]>('http://localhost:3000/clubs').subscribe({
      next: (clubs) => {
        this.universityClubs = clubs.map((c) => ({
          value: c.club_id,
          display: c.display_name,
        }));
      },
      error: (err) => console.error('Failed to load clubs:', err),
    });

    // Dynamic validators for role
    this.frm.get('role')?.valueChanges.subscribe((roleValue) => {
      const clubControl = this.frm.get('universityClub');
      const userClubsControl = this.frm.get('userClubs');

      if (roleValue === 'organizer') {
        clubControl?.setValidators([Validators.required]);
        userClubsControl?.clearValidators();
        this.clearFormArray(this.userClubsArray);
      } else if (roleValue === 'user') {
        userClubsControl?.setValidators([Validators.required]);
        clubControl?.clearValidators();
        clubControl?.setValue('');
      } else {
        clubControl?.clearValidators();
        clubControl?.setValue('');
        userClubsControl?.clearValidators();
        this.clearFormArray(this.userClubsArray);
      }

      clubControl?.updateValueAndValidity();
      userClubsControl?.updateValueAndValidity();
    });

    // Load user profile if logged in
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId) this.fetchUserProfile(this.userId);
    }
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }

  fetchUserProfile(userId: string) {
    this.http
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe({
        next: (res) => {
          // Patch basic fields
          this.frm.patchValue({
            ...res,
            universityClub: res.club_id || '',
          });

          // Patch multi-select clubs
          this.clearFormArray(this.userClubsArray);
          if (res.userClubs && Array.isArray(res.userClubs)) {
            res.userClubs.forEach((clubId: number) => {
              this.userClubsArray.push(this.fb.control(clubId));
            });
          }

          this.frm.get('role')?.disable(); // prevent role change
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to load user profile', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  onUserClubChange(event: any, clubValue: number) {
    if (event.target.checked) {
      this.userClubsArray.push(this.fb.control(clubValue));
    } else {
      const index = this.userClubsArray.controls.findIndex(
        (ctrl) => ctrl.value === clubValue
      );
      if (index > -1) this.userClubsArray.removeAt(index);
    }
  }

  onPost() {
    if (!this.userId) {
      this.snackBar.open('User ID missing. Please log in again.', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.frm.invalid) {
      this.snackBar.open(
        'Please fill all required fields correctly.',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }

    const payload: any = { ...this.frm.value };

    if (this.frm.value.role === 'user') {
      payload.userClubs = this.userClubsArray.value;
      delete payload.universityClub;
    } else if (this.frm.value.role === 'organizer') {
      payload.club_id = payload.universityClub
        ? Number(payload.universityClub)
        : null;
      delete payload.userClubs;
      delete payload.universityClub;
    }

    this.http
      .put(`http://localhost:3000/user/profile/${this.userId}`, payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to update profile. Try again.', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  onCancel() {
    this.frm.reset();
    if (this.userId) this.fetchUserProfile(this.userId);
  }
}
