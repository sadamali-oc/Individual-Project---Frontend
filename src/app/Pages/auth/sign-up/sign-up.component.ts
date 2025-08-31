import { Component, Inject, OnInit } from '@angular/core';
import { SignupService } from '../../../services/signup.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { validPattern } from '../../../helpers/pattern-mact.validator';
import { MustMatch } from '../../../helpers/must-match.validator';
import { Status } from '../../../models/status';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
})
export class SignUpComponent implements OnInit {
  frm!: FormGroup;
  status: Status = { statusCode: 0, message: '' };

  universityClubs: {
    value: string | number;
    display: string;
    disabled: boolean;
  }[] = [];

  constructor(
    @Inject(SignupService) private signupService: SignupService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  get f() {
    return this.frm.controls;
  }

  ngOnInit(): void {
    // Load clubs from backend
    this.http.get<any[]>('http://localhost:3000/clubs').subscribe({
      next: (clubs) => {
        // Initialize clubs
        this.universityClubs = clubs.map((c) => ({
          value: c.club_id,
          display: c.display_name,
          disabled: false,
        }));

        // Fetch existing organizers to disable occupied clubs
        this.http
          .get<any[]>('http://localhost:3000/users/organizers')
          .subscribe({
            next: (organizers) => {
              const occupiedClubIds = organizers
                .filter((o) => o.club_id) // only organizers with club
                .map((o) => o.club_id);

              this.universityClubs = this.universityClubs.map((club) => ({
                ...club,
                disabled: occupiedClubIds.includes(club.value),
              }));
            },
            error: (err) => console.error('Failed to load organizers:', err),
          });
      },
      error: (err) => {
        console.error('Failed to load clubs:', err);
      },
    });

    const patternRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$'
    );

    this.frm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone_number: ['', Validators.required],
        password: ['', [Validators.required, validPattern(patternRegex)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        gender: ['', Validators.required],
        universityClub: [''],
        userClubs: [[], Validators.required], // for multiple clubs
      },
      {
        validator: MustMatch(
          'password',
          'confirmPassword',
          'Passwords must match'
        ),
      }
    );

    // Dynamic validator based on role
    this.frm.get('role')?.valueChanges.subscribe((roleValue) => {
      const clubControl = this.frm.get('universityClub');
      const userClubsControl = this.frm.get('userClubs');

      if (roleValue === 'organizer') {
        clubControl?.setValidators([Validators.required]);
        userClubsControl?.clearValidators();
        userClubsControl?.setValue([]);
      } else if (roleValue === 'user') {
        userClubsControl?.setValidators([Validators.required]);
        clubControl?.clearValidators();
        clubControl?.setValue('');
      } else {
        clubControl?.clearValidators();
        clubControl?.setValue('');
        userClubsControl?.clearValidators();
        userClubsControl?.setValue([]);
      }

      clubControl?.updateValueAndValidity();
      userClubsControl?.updateValueAndValidity();
    });
  }

  onUserClubChange(event: any) {
    const userClubs = this.frm.get('userClubs');
    const selectedClubs = userClubs?.value || [];

    if (event.target.checked) {
      selectedClubs.push(event.target.value);
    } else {
      const index = selectedClubs.indexOf(event.target.value);
      if (index > -1) selectedClubs.splice(index, 1);
    }

    userClubs?.setValue(selectedClubs);
    userClubs?.updateValueAndValidity();
  }

  private showSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onPost() {
    this.status = { statusCode: 0, message: 'Please wait...' };

    if (this.frm.invalid) {
      this.showSnackBar('Please fill all required fields correctly.');
      return;
    }

    const payload: any = { ...this.frm.value };

    // Map clubs correctly
    if (this.frm.value.role === 'user') {
      payload.userClubs = this.frm.value.userClubs.map((id: any) => Number(id));
      delete payload.universityClub;
    } else if (this.frm.value.role === 'organizer') {
      payload.club_id = this.frm.value.universityClub
        ? Number(this.frm.value.universityClub)
        : null;
      delete payload.userClubs;
    }

    this.signupService.signup(payload).subscribe({
      next: (res) => {
        this.status = {
          statusCode: 1,
          message: 'Signup successful! Redirecting...',
        };
        this.showSnackBar('Signup successful! Redirecting...');
        this.frm.reset();
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err: any) => {
        console.error(err);
        const backendMsg = err.error?.message;
        this.showSnackBar(backendMsg || 'Signup failed! Try again.', 4000);
        this.status = {
          statusCode: -1,
          message: backendMsg || 'Error occurred.',
        };
      },
    });
  }
}
