import { Component, Inject, OnInit } from '@angular/core';
import { SignupService } from '../../../services/signup.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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

  universityClubs: { value: string | number; display: string }[] = [];

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
    // Load clubs from backend and map to {value, display}
    this.http.get<any[]>('http://localhost:3000/clubs').subscribe({
      next: (clubs) => {
        this.universityClubs = clubs.map((c) => ({
          value: c.club_id,
          display: c.display_name,
        }));
        console.log(this.universityClubs);
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
      },
      {
        validator: MustMatch(
          'password',
          'confirmPassword',
          'Passwords must match'
        ),
      }
    );

    // Dynamic validator: universityClub required only if role === 'organizer'
    this.frm.get('role')?.valueChanges.subscribe((roleValue) => {
      const clubControl = this.frm.get('universityClub');
      if (roleValue === 'organizer') {
        clubControl?.setValidators([Validators.required]);
      } else {
        clubControl?.clearValidators();
        clubControl?.setValue('');
      }
      clubControl?.updateValueAndValidity();
    });
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

    // Map universityClub to club_id (number) for backend
    const payload = {
      ...this.frm.value,
      club_id: this.frm.value.universityClub
        ? Number(this.frm.value.universityClub)
        : null,
    };
    delete payload.universityClub;

    this.signupService.signup(payload).subscribe({
      next: (res) => {
        this.status = {
          statusCode: 1,
          message: 'Signup successful! Redirecting...',
        };

        // ✅ Success snackbar
        this.showSnackBar('Signup successful! Redirecting...');

        this.frm.reset();
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err: any) => {
        console.error(err);

        const backendMsg = err.error?.message;

        if (backendMsg === 'This club already has an assigned Organizer') {
          // ✅ Special case snackbar
          this.showSnackBar(backendMsg, 4000);
          this.status = { statusCode: -1, message: backendMsg };
        } else {
          this.showSnackBar(backendMsg || 'Signup failed! Try again.', 4000);
          this.status = {
            statusCode: -1,
            message:
              backendMsg || 'Error: Email already exists or server error.',
          };
        }
      },
    });

    console.log(payload);
  }
}
