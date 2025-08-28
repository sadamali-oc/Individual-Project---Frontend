// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Notification {
  notification_id: number;
  user_id: number;
  event_id: number | null;
  message: string;   
  is_read: boolean;
  created_at: string;
}


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.apiUrl}/${notificationId}/read`,
      {}
    );
  }
}
