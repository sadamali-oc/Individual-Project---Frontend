// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { SignupRequestModel } from '../models/signupReqModel';
// import { LoginRequestModel } from '../models/loginRequestModel';
// import { ChangePassword } from '../models/change-password';
// import { Status } from '../models/status';
// import { LoginResponseModel } from '../models/login-response';
// import { environment } from '../../environments/environment.prod';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignupService {
//   // private baseUrl = '/apiUrl/authorization';
//   private apiUrl = 'http://localhost:3000/api/v1/users';  // Replace with your actual backend API URL

//   constructor(private http: HttpClient) {}

//   //authentication services

//   login(model: LoginRequestModel) {
//     return this.http.post<LoginResponseModel>(
//       this.baseUrl + '/login',
//       model,
//       {}
//     );
//   }

//   signup(model: SignupRequestModel) {
//     return this.http.post<Status>(this.baseUrl + '/signup', model, {});
//   }

//   changePassword(model: ChangePassword) {
//     return this.http.post<Status>(this.baseUrl + '/changepassword', model);
//   }

//   // Implement change password logic here

//   // // Method to handle user signup
//   // signup(userData: any): Observable<any> {
//   //   return this.http.post(`${this.apiUrl}/signup`, userData, {
//   //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   //   });
//   // }

//   // // Method to handle user login
//   // login(credentials: any): Observable<any> {
//   //   return this.http.post(`${this.apiUrl}/login`, credentials, {
//   //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   //   });
//   // }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from '../models/status'; // Assuming you have a Status model

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:3000/user/register'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<Status> {
    return this.http.post<Status>(this.apiUrl, userData);
  }
}
