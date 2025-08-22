import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  event_id: number;
  user_id: number;
  event_name: string;
  event_date: Date;
  start_time: string;
  end_time: string;
  location: string;
  event_mode: string;
  audience_type: string;
  status: string;
  isEnrolled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiBase}/all/events`);
  }

  enrollUser(eventId: number, userId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiBase}/events/${eventId}/enroll/${userId}`,
      { user_id: userId }
    );
  }

  cancelEnrollment(
    eventId: number,
    userId: number
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiBase}/events/${eventId}/enroll/${userId}`,
      { body: { user_id: userId } } // important for DELETE with body
    );
  }

  getUserEnrollments(userId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiBase}/users/${userId}/enrolled-events`
    );
  }

  getEventEnrollments(eventId: number) {
    return this.http.get<any[]>(
      `${this.apiBase}/events/${eventId}/enrollments`
    );
  }

  // In EventService
  getEventMessages(eventId: number) {
    return this.http.get<any[]>(`${this.apiBase}/events/${eventId}/chat`);
  }
  sendEventMessage(
    eventId: number,
    payload: { message: string; user_id: number }
  ) {
    return this.http.post<any>(
      `${this.apiBase}/events/${eventId}/chat`,
      payload
    );
  }
}
