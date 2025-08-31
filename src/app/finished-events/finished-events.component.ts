import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../components/event-details-dialog/event-details-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finished-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './finished-events.component.html',
  styleUrls: ['./finished-events.component.css'],
})
export class FinishedEventsComponent implements OnInit {
  events: any[] = [];
  isLoading = true;
  userId: string | null = null;
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.fetchFinishedEvents(this.userId);
      }
    });
  }

  fetchFinishedEvents(userId: string): void {
    this.http
      .get<any[]>(`http://localhost:3000/events/finished/${userId}`)
      .subscribe({
        next: (data) => {
          this.events = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching finished events:', err);
          this.isLoading = false;
        },
      });
  }

  viewDetails(event: any): void {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#1976d2';
      case 'pending':
        return '#ffcc00';
      case 'completed':
        return '#388e3c';
      default:
        return '#888';
    }
  }

  get filteredEvents() {
    return this.events.filter((event) => {
      if (!this.searchTerm) return true;
      return event.event_name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
    });
  }

  deleteEvent(event: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete "${event.event_name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.http
          .delete(`http://localhost:3000/events/${event.event_id}`)
          .subscribe({
            next: () => {
              this.snackBar.open('Event deleted', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
              this.events = this.events.filter(
                (e) => e.event_id !== event.event_id
              );
            },
            error: () => {
              this.snackBar.open('Failed to delete event', 'Close', {
                duration: 3000,
              });
            },
          });
      }
    });
  }
}
