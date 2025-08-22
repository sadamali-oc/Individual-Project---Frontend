// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<any> {
    // Replace with your backend API
    return this.http.get(`/users/${userId}`);
  }
}
