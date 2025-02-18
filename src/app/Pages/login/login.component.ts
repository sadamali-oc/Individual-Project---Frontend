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
  imports: [FormsModule,CommonModule],
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
  onLogin() {
    console.log('Login Attempt:', this.loginObj);
  
    // Send POST request to the backend for login
    this.httpClient.post<any>('http://localhost:3000/user/login', this.loginObj).subscribe(
      (response) => {
        console.log('Login successful:', response);  // Check the response from backend
  
        // Make sure the message is 'Login successful' and role exists
        if (response.message === 'Login successful') {
          // Access role from response.user
          const role = response.user?.role ? response.user.role.toLowerCase() : null;
  
          if (role) {
            // Log the role to ensure it’s being retrieved correctly
            console.log('User Role:', role); 
  
            // Now, perform the redirection
            this.redirectBasedOnRole(role);
          } else {
            console.log('Role missing in the response');
            alert('Role is missing in the response');
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
  
  redirectBasedOnRole(role: string) {
    console.log('Redirecting based on role:', role);
    
    // Check the role and navigate accordingly
    if (role === 'admin') {
      this.router.navigate(['admin/dashboard']);
    } else if (role === 'user') {
      this.router.navigate(['user/dashboard']);
    } else if (role === 'organizer') {
      this.router.navigate(['organizer/dashboard']);
    } else {
      alert('Role not recognized');
    }
  }
  

 

  // Navigate to SignUp page
  gotoSignUp() {
    this.router.navigate(['/signup']);
  }
}
