// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  // add other fields if needed
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.baseUrl}/user`;

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile/${userId}`);
  }
}
