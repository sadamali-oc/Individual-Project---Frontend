import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:3000/user/register'; // Backend API URL

  constructor(private http: HttpClient) {}

  /**
   * Signup a new user or organizer.
   * Handles both single club (organizer) and multiple clubs (user)
   */
  signup(userData: any): Observable<Status> {
    const payload: any = { ...userData };

    // Map club fields depending on role
    if (userData.role === 'user' && Array.isArray(userData.userClubs)) {
      payload.userClubs = userData.userClubs.map((id: any) => Number(id));
      delete payload.club_id; // ensure no single club field
    } else if (userData.role === 'organizer') {
      payload.club_id = userData.universityClub
        ? Number(userData.universityClub)
        : null;
      delete payload.userClubs; // ensure no multiple clubs field
    }

    return this.http.post<Status>(this.apiUrl, payload);
  }
}
