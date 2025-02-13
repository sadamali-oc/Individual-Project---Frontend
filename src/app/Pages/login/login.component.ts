import { Component, inject } from '@angular/core';
// Import FormsModule
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';



@Component({


  //pass object to component

  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],

})





export class LoginComponent {
  loginObj: any = {
    username: '',
    password: '',
  };

  router = inject(Router);

  loginError: string = '';


  onLogin() {
    console.log('Login Attempt:', this.loginObj);
    if (this.loginObj.username === 'admin' && this.loginObj.password === '1234') {
      alert('Login Successful');
      this.router.navigate(['/dashboard']); // Redirect to landing page
    } else {
      console.error('Login failed: Invalid credentials');
      alert('Login Failed: Invalid credentials');
    }
  }



  gotoSignUp() {
    this.router.navigate(['/signup']);
  }
  


  
}
