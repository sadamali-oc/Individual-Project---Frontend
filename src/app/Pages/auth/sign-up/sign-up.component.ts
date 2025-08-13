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
    private snackBar: MatSnackBar // <-- Inject MatSnackBar here
  ) {}

  get f() {
    return this.frm.controls;
  }

  ngOnInit(): void {
    // Load clubs from backend and map to {value, display}
    this.http.get<any[]>('http://localhost:3000/clubs').subscribe({
      next: (clubs) => {
        this.universityClubs = clubs.map((c) => ({
          value: c.club_id, // club_id as value
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
        universityClub: [''], // Initially no validator
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

  onPost() {
    this.status = { statusCode: 0, message: 'Please wait...' };

    if (this.frm.invalid) {
      // You can optionally notify user to fix validation errors here
      return;
    }

    this.snackBar.open('Signup successful!', 'Close', {
      duration: 3000,
      horizontalPosition:'center',
      verticalPosition:'top'
    });

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
        this.frm.reset();
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err: any) => {
        console.error(err);
        this.status = {
          statusCode: -1,
          message: 'Error: Email already exists or server error.',
        };
      },
    });

    console.log(payload);
  }
}
