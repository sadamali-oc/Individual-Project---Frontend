import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { BehaviorSubject } from 'rxjs';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AttendeesDialogComponent } from '../attendees-dialog/attendees-dialog.component';
import { CommentChatComponent } from '../comment-chat/comment-chat.component';
import { CommentService } from '../../services/comment/comment.service'; // import the service

interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  flyer_image?: string;
  status: string;
  event_status: string;
  unreadMessages?: number;
}

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
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule,
    MatBadgeModule,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  userId: string | null = null;
  currentUserId!: number;
  selectedStatus: string = '';
  searchTerm: string = '';

  // Map of unread message counts per event
  unreadCounts = new Map<number, BehaviorSubject<number>>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private commentService: CommentService // inject CommentService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.currentUserId = Number(this.userId);
        this.fetchEvents(this.userId);
      }
    });

    // Subscribe to new comment notifications
    this.commentService.newComment$.subscribe(({ event_id }) => {
      const currentCount = this.unreadCounts.get(event_id)?.value || 0;
      this.updateUnreadCount(event_id, currentCount + 1);
    });
  }

  fetchEvents(userId: string): void {
    this.http.get<Event[]>(`http://localhost:3000/event/${userId}`).subscribe({
      next: (data) => {
        this.events = data;

        // Initialize BehaviorSubjects for unread counts
        this.events.forEach((e) => {
          this.unreadCounts.set(
            e.event_id,
            new BehaviorSubject(e.unreadMessages || 0)
          );
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.isLoading = false;
      },
    });
  }

  getUnreadCountObservable(event: Event) {
    return this.unreadCounts.get(event.event_id)?.asObservable();
  }

  updateUnreadCount(eventId: number, newCount: number) {
    const subject = this.unreadCounts.get(eventId);
    if (subject) {
      subject.next(newCount);
      this.cdr.detectChanges();
    }
  }

  viewAttendees(event: Event) {
    this.dialog.open(AttendeesDialogComponent, {
      width: '600px',
      data: { event_id: event.event_id, event_name: event.event_name },
    });
  }

  openChat(event: Event) {
    this.dialog.open(CommentChatComponent, {
      width: '700px',
      data: {
        event_id: event.event_id,
        event_name: event.event_name,
        user_id: this.currentUserId,
      },
    });

    // Reset unread count when opening chat
    this.updateUnreadCount(event.event_id, 0);
  }

  onToggleChange(eventItem: Event, isChecked: boolean) {
    const newStatus = isChecked ? 'completed' : 'upcoming';
    this.http
      .put(`http://localhost:3000/events/${eventItem.event_id}/progress`, {
        event_status: newStatus,
      })
      .subscribe({
        next: () => {
          eventItem.event_status = newStatus;
          this.snackBar.open(`Event marked as ${newStatus}`, 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.snackBar.open('Failed to update status', 'Close', {
            duration: 3000,
          });
        },
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
    const term = this.searchTerm.toLowerCase();
    return this.events.filter(
      (e) =>
        (!this.selectedStatus || e.status === this.selectedStatus) &&
        (!term || e.event_name.toLowerCase().includes(term))
    );
  }

  viewDetails(event: Event) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }

  deleteEvent(event: Event) {
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
              this.snackBar.open('Event deleted', 'Close', { duration: 3000 });
              this.events = this.events.filter(
                (e) => e.event_id !== event.event_id
              );
              this.unreadCounts.delete(event.event_id);
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
