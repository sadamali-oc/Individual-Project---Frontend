import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, MatIconModule, MatSnackBarModule],
})
export class LoginComponent {
  showPassword = false;
  loginObj: any = {
    username: '',
    password: '',
  };
  loginError: string = '';

  router = inject(Router);
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  gotoForgetPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  gotoSignUp() {
    this.router.navigate(['/auth/signup']);
  }

  onLogin() {
    console.log('Login Attempt:', this.loginObj);

    this.http
      .post<any>('http://localhost:3000/user/auth/login', this.loginObj)
      .subscribe(
        (response) => {
          if (response.message === 'Login successful') {
            const role = response.user?.role?.toLowerCase();
            const userId = response.user?.user_id;

            if (role && userId) {
              localStorage.setItem('user_id', userId);
              this.snackBar.open('Login successful!', 'Close', {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });

              setTimeout(() => {
                this.getUserDetails(userId, role);
              }, 2000);
            } else {
              this.showError('Role or User ID is missing in the response');
            }
          } else {
            this.showError('Invalid credentials. Please try again.');
          }
        },
        (error) => {
          console.error('Login error:', error);
          this.showError('An error occurred while logging in');
        }
      );
  }

  getUserDetails(userId: string, role: string) {
    this.http
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe(
        () => {
          this.redirectBasedOnRole(role, userId);
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.showError('An error occurred while fetching user details');
        }
      );
  }

  redirectBasedOnRole(role: string, userId: string) {
    switch (role) {
      case 'admin':
        this.router.navigate([`/admin/${userId}/dashboard`]);
        break;
      case 'user':
         this.router.navigate([`/user/${userId}/dashboard`]);
        break;
      case 'organizer':
        this.router.navigate([`/organizer/${userId}/dashboard`]);
        break;
      default:
        this.showError('Role not recognized');
    }
  }

  showError(message: string) {
    this.loginError = message;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }
}
