import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../helpers/must-match.validator';
import { validPattern } from '../../helpers/pattern-mact.validator';
import { Status } from '../../models/status';
import { SignupService } from '../../services/signup.service';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserProfileComponent implements OnInit {
  frm!: FormGroup;
  status!: Status;
  userId: string | null = null;

  constructor(
    @Inject(SignupService) private signupService: SignupService,
    private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  get f() {
    return this.frm.controls;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId) {
        this.fetchUserProfile(this.userId);
      }
    }

    const patternRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$'
    );

    this.frm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone_number: [
          '',
          [Validators.required, Validators.pattern('^[0-9]+$')],
        ],
        password: ['', [Validators.required, validPattern(patternRegex)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        gender: ['', Validators.required],
        status: ['', Validators.required],
      },
      {
        validator: MustMatch(
          'password',
          'confirmPassword',
          'Passwords must match'
        ),
      }
    );
  }

  fetchUserProfile(userId: string) {
    this.httpClient
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe(
        (response) => {
          this.frm.patchValue(response);
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.snackBar.open('Failed to load user profile', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  onPost() {
    if (!this.userId) {
      console.error('User ID is missing. Cannot update profile.');
      this.snackBar.open('User ID is missing. Please log in again.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.status = { statusCode: 0, message: 'Updating profile...' };

    this.httpClient
      .put(`http://localhost:3000/user/profile/${this.userId}`, this.frm.value)
      .subscribe({
        next: (res) => {
          console.log('Profile updated:', res);
          console.log(this.userId);
          this.status = {
            statusCode: 200,
            message: 'Profile updated successfully!',
          };
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.status = {
            statusCode: 500,
            message: 'Failed to update profile. Please try again.',
          };
          this.snackBar.open(
            'Failed to update profile. Please try again.',
            'Close',
            { duration: 3000 }
          );
        },
      });
  }

  onCancel() {
    this.frm.reset();
    this.status = {
      statusCode: 0,
      message: 'Profile update canceled. All changes were discarded.',
    };
  }
}
