import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../../event-details-dialog/event-details-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  events: any[] = [];
  isLoading = true;
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // <-- Inject MatSnackBar here!
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.fetchEvents(this.userId);
      }
    });
  }

  fetchEvents(userId: string): void {
    this.http.get<any[]>(`http://localhost:3000/event/${userId}`).subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#1976d2';
      case 'pending':
        return '#ffa000';
      case 'completed':
        return '#388e3c';
      default:
        return '#555';
    }
  }

  viewDetails(event: any): void {
    console.log('View details for:', event);
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }

  deleteEvent(event: any): void {
    if (
      confirm(
        `Are you sure you want to delete the event "${event.event_name}"?`
      )
    ) {
      const url = `http://localhost:3000/events/${event.event_id}`;

      this.http.delete(url).subscribe({
        next: (response: any) => {
          console.log('Event deleted:', response);
          this.snackBar.open('Event deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top', // <-- add this line
          });

          // Remove the deleted event from the local events array
          this.events = this.events.filter(
            (e: any) => e.event_id !== event.event_id
          );
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Failed to delete event', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
}
