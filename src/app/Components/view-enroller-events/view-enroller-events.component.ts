import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EventService, Event } from '../../services/event/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../../components/event-details-dialog/event-details-dialog.component';
import { CommentChatComponent } from '../comment-chat/comment-chat.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-view-enrolled-events',
  templateUrl: './view-enroller-events.component.html',
  styleUrls: ['./view-enroller-events.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatBadgeModule,
  ],
})
export class ViewEnrollerEventsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'event_name',
    'event_date',
    'event_mode',
    'audience_type',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Event>([]);
  currentUserId!: number;

  searchTerm: string = '';
  newMessageMap: { [eventId: number]: boolean } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  event: any;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const parentParams = this.route.parent?.snapshot.paramMap;
    const userId = parentParams?.get('userId');

    if (userId) {
      this.currentUserId = +userId;
      this.loadEnrolledEvents();
    } else {
      this.snackBar.open('User ID not found in route', 'Close', {
        duration: 3000,
      });
    }

    this.dataSource.filterPredicate = (data: Event, filter: string) => {
      return data.event_name
        .toLowerCase()
        .includes(this.searchTerm.trim().toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEnrolledEvents(): void {
    this.eventService.getUserEnrollments(this.currentUserId).subscribe({
      next: (enrolledIds) => {
        this.eventService.getAllEvents().subscribe({
          next: (events) => {
            const enrolledEvents = events.filter((e) =>
              enrolledIds.includes(e.event_id)
            );
            enrolledEvents.forEach((e) => (e.isEnrolled = true));
            this.dataSource.data = enrolledEvents;
          },
          error: (err) => {
            console.error('Failed to load events:', err);
            this.snackBar.open('Failed to load events', 'Close', {
              duration: 3000,
            });
          },
        });
      },
      error: (err) => {
        console.error('Failed to load enrollments:', err);
        this.snackBar.open('Failed to load enrollments', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  applyFilter() {
    this.dataSource.filter = '' + Math.random();
  }

  clearFilter() {
    this.searchTerm = '';
    this.applyFilter();
  }

  viewDetails(event: Event) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#f9a825';
      case 'approved':
        return '#2e7d32';
      case 'rejected':
        return '#c62828';
      default:
        return '#012a6c';
    }
  }

  openChat(event: any) {
    this.dialog.open(CommentChatComponent, {
      width: '700px',
      data: {
        event_id: event.event_id,
        event_name: event.event_name,
        user_id: this.currentUserId,
      },
    });
  }
}
