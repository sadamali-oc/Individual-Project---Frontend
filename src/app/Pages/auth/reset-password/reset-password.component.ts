import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';  // <-- Import this!

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true, // <-- add this to make it standalone component
  imports: [
    ReactiveFormsModule, // <-- add this for formGroup directive
    MatIconModule,
    CommonModule
  ],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  resetToken: string = '';

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Capture token from query params
    this.route.queryParams.subscribe((params) => {
      this.resetToken = params['token'] || '';
    });

    // Initialize form
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    if (!this.resetToken) {
      this.snackBar.open('Invalid or missing reset token.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;
    this.http
      .post('http://localhost:3000/auth/reset-password', {
        token: this.resetToken,
        newPassword: this.resetForm.value.newPassword,
      })
      .subscribe({
        next: (res: any) => {
          this.snackBar.open(
            res.message || 'Password reset successful!',
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/auth/login']);
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open(
            err.error.message || 'Error resetting password.',
            'Close',
            { duration: 3000 }
          );
          this.isLoading = false;
        },
      });
  }

  gotoLogin() {
    this.router.navigate(['/auth/login']);
  }
}
