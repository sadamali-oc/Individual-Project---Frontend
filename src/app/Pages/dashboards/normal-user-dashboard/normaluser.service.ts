import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NormalUserService {
  private apiUrl = 'http://localhost:3000'; // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch user profile by userId
  getUserProfile(userId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/user/profile/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // Fetch all events
  getAllEvent(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/event/all/events`)
      .pipe(catchError(this.handleError));
  }

  // Fetch events by userId
  getEvent(userId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/event/events/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // NEW: Fetch current month events
  getCurrentMonthEvents(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/events/current-month`)
      .pipe(catchError(this.handleError));
  }

  // Error handling method with safe ErrorEvent check
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (
      typeof ErrorEvent !== 'undefined' &&
      error.error instanceof ErrorEvent
    ) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
