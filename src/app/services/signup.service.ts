
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
