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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SignUpComponent implements OnInit {
  frm!: FormGroup;
  status!: Status;

  universityClubs = [
    { value: 'astronomical', display: 'Astronomical Society' },
    { value: 'buddhist', display: 'Buddhist Society' },
    { value: 'catholic_students', display: "Catholic Students' Society" },
    { value: 'civil_engineering', display: 'Civil Engineering Society' },
    { value: 'computer', display: 'Computer Society' },
    {
      value: 'electrical_engineering',
      display: 'Electrical Engineering Society',
    },
    { value: 'electronic', display: 'Electronic Club' },
    { value: 'english_literary', display: 'English Literary Association' },
    { value: 'gavel', display: 'Gavel Club' },
    { value: 'leo', display: 'LEO Club' },
    { value: 'mathematics', display: 'Mathematics Society' },
    {
      value: 'mechanical_engineering',
      display: 'Mechanical Engineering Society',
    },
    { value: 'media', display: 'Media Club' },
    {
      value: 'transport_logistics',
      display: 'Society of Transport & Logistics',
    },
    { value: 'majlis_ui_islam', display: 'Majlis Ui Islam Society' },
    { value: 'maritime', display: 'Maritime Club' },
    {
      value: 'materials_engineering',
      display: "Materials Engineering Students' Society",
    },
    {
      value: 'christian_fellowship',
      display: 'Moratuwa Students Christian Fellowship',
    },
    { value: 'ethugalpura', display: "Ethugalpura Students' Circle" },
    { value: 'students_union', display: "University Students' Union" },
    { value: 'faculty_union', display: "Faculty Students' Unions" },
  ];

  constructor(
    @Inject(SignupService) private signupService: SignupService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get f() {
    return this.frm.controls;
  }

  ngOnInit(): void {
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
        status: ['', Validators.required],
        universityClub: [''], // No validator initially
      },
      {
        validator: MustMatch(
          'password',
          'confirmPassword',
          'Passwords must match'
        ),
      }
    );

    // Dynamic validator for universityClub based on role
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
    this.status = { statusCode: 0, message: 'Wait..' };

    this.signupService.signup(this.frm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.status = res;
        this.frm.reset();
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.error(err);
        this.status.message = 'Some error on server side';
      },
      complete: () => {
        this.status.statusCode = 0;
        this.status.message = '';
      },
    });

    console.log(this.frm.value);
  }
}
