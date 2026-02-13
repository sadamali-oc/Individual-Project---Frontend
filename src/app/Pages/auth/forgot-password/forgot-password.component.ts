import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule, // ✅ Add this
    // any other modules like FormsModule, RouterModule, etc.
  ],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.http
      .post<any>(
        'http://localhost:3000/auth/forgot-password',
        this.forgotForm.value
      )
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message || 'Reset link sent!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.router.navigate(['/auth/login']);
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open(
            err.error.message || 'Error sending link.',
            'Close',
            {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
          this.isLoading = false;
        },
      });
  }

  gotoLogin() {
    this.router.navigate(['/auth/login']);
  }
}
