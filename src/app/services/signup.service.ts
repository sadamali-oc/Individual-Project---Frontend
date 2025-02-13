import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestModel } from '../models/signupReqModel';
import { LoginRequestModel } from '../models/loginRequestModel';
import { ChangePassword } from '../models/change-password';
import { Status } from '../models/status';
import { LoginResponseModel } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiUrl = '/api'; // Proxy is set to forward to http://localhost:3000

  constructor(private http: HttpClient) {



   }

//authentication services


   login(model:  LoginRequestModel){
    return this.http.post<LoginResponseModel>(this.apiUrl + '/login', model, {
    });
   }

   signup(model: SignupRequestModel){
    return this.http.post<Status>(this.apiUrl + '/signup', model, {
    });
   }

   changePassword(model: ChangePassword){
    return this.http.post<Status>(this.apiUrl+'/changepassword',model);
   }



     // Implement change password logic here
   

  // // Method to handle user signup
  // signup(userData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/signup`, userData, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }

  // // Method to handle user login
  // login(credentials: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }
}
