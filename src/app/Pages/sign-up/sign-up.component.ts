import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../services/signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone:true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  constructor(private signupService: SignupService, private fb: FormBuilder) {}

  frm!: FormGroup;

  get f() {
    return this.frm.controls;
  }

  onPost() {
    console.log(this.frm.value);
  }

  ngOnInit(): void {
    this.frm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
}
