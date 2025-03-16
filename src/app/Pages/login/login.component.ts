import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  loginObj: any = {
    username: '',
    password: '',
  };

  router = inject(Router);
  http = inject(HttpClient);  // Inject HttpClient for API calls
  loginError: string = '';

  constructor(private httpClient: HttpClient) {}

  // Handle the login process
  onLogin() {
    console.log('Login Attempt:', this.loginObj);

    // Send POST request to the backend for login
    this.httpClient.post<any>('http://localhost:3000/user/auth/login', this.loginObj).subscribe(
      (response) => {
        console.log('Login successful:', response);

        // Check if login was successful
        if (response.message === 'Login successful') {
          // Access role and user_id from response
          const role = response.user?.role ? response.user.role.toLowerCase() : null;
          const userId = response.user?.user_id;

          if (role && userId) {
            console.log('User Role:', role);
            console.log('User ID:', userId);
            
            // Store the user_id in localStorage (or any other preferred storage)
            localStorage.setItem('user_id', userId);  // Storing user_id in localStorage

            // Now, make another API call to get additional user details, if necessary
            this.getUserDetails(userId, role);  // Pass the userId and role
          } else {
            console.log('Role or User ID missing in the response');
            alert('Role or User ID is missing in the response');
          }
        } else {
          console.log('Login failed');
          alert('Login Failed: Invalid credentials');
        }
      },
      (error) => {
        console.error('Login error:', error);
        alert('An error occurred while logging in');
      }
    );
  }

  // Fetch user details based on userId (optional, if you need additional user details)
  getUserDetails(userId: string, role: string) {
    console.log('Fetching user details for user ID:', userId);

    // Make an API call to fetch user details based on userId
    this.httpClient.get<any>(`http://localhost:3000/user/profile/${userId}`).subscribe(
      (response) => {
        console.log('User Details:', response);
        // Once user details are fetched, redirect based on the role
        this.redirectBasedOnRole(role, userId);  // Pass the userId for redirection
      },
      (error) => {
        console.error('Error fetching user details:', error);
        alert('An error occurred while fetching user details');
      }
    );
  }

  // Redirect based on the user role
  redirectBasedOnRole(role: string, userId: string) {
    console.log('Redirecting based on role:', role);

    if (role === 'admin') {
      // Redirect to the admin dashboard with userId in the URL
      this.router.navigate([`/admin/dashboard/${userId}`]);
    } else if (role === 'user') {
      // Redirect to the user dashboard with userId in the URL
      this.router.navigate([`/user/dashboard/${userId}`]);
    } else if (role === 'organizer') {
      // Redirect to the organizer dashboard with userId in the URL
      this.router.navigate([`/organizer/dashboard/${userId}`]);
    } else {
      alert('Role not recognized');
    }
  }

  // Navigate to SignUp page
  gotoSignUp() {
    this.router.navigate(['/auth/signup']);
  }
}
