import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../services/signup.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // <-- Import Router
import { validPattern } from '../../helpers/pattern-mact.validator';
import { MustMatch } from '../../helpers/must-match.validator';
import { Status } from '../../models/status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports:[  CommonModule,  ReactiveFormsModule, // Add ReactiveFormsModule here
  ]
})
export class SignUpComponent implements OnInit {
  frm!: FormGroup;
  status!: Status;

  constructor(
    private signupService: SignupService,
    private fb: FormBuilder,
    private router: Router  
  ) {}

  get f() {
    return this.frm.controls;
  }

  onPost() {
    this.status = { statusCode: 0, message: 'Wait..' };
    
    // Submit the form data to the backend via the signup service
    this.signupService.signup(this.frm.value).subscribe({
      next: (res) => {
        console.log(res); // Log the response
        this.status = res;
        this.frm.reset(); // Reset form on successful submission
        
        // Navigate to login page after successful signup
        this.router.navigate(['/login']);  // <-- Navigate to login page
      },
      error: (err) => {
        console.error(err); // Log the error
        this.status.message = 'Some error on server side'; // Set error message
      },
      complete: () => {
        this.status.statusCode = 0;
        this.status.message = '';
      },
    });

    console.log(this.frm.value); // Log form data for debugging
  }

  ngOnInit(): void {
    // Regex pattern for password validation
    const patternRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$'
    );

    // Define the form group with validation rules
    this.frm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone_number: ['', Validators.required],
        password: ['', [Validators.required, validPattern(patternRegex)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        gender: ['', Validators.required], // Added gender field
        status: ['', Validators.required], // Added status field
      },
      {
        // Custom validator for matching passwords
        validator: MustMatch('password', 'confirmPassword', 'Passwords must match'),
      }
    );
  }
}
