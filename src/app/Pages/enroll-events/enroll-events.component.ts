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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EventDetailsDialogComponent } from '../../components/event-details-dialog/event-details-dialog.component';

@Component({
  selector: 'app-enroll-events',
  templateUrl: './enroll-events.component.html',
  styleUrls: ['./enroll-events.component.css'],
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
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class EnrollEventsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'event_name',
    'event_date',
    'event_mode',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Event>([]);
  currentUserId!: number;

  searchTerm: string = '';
  selectedStatus: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
      this.loadEvents();
    } else {
      this.snackBar.open('User ID not found in route', 'Close', {
        duration: 3000,
      });
    }

    // Custom filter to handle search + status
    this.dataSource.filterPredicate = (data: Event, filter: string) => {
      const searchTerm = this.searchTerm.trim().toLowerCase();
      const matchesName = data.event_name.toLowerCase().includes(searchTerm);
      const matchesStatus =
        !this.selectedStatus || data.status === this.selectedStatus;
      return matchesName && matchesStatus;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.eventService.getUserEnrollments(this.currentUserId).subscribe({
          next: (enrolledIds) => {
            events.forEach(
              (e) => (e.isEnrolled = enrolledIds.includes(e.event_id))
            );
            this.dataSource.data = events;
            this.dataSource._updateChangeSubscription();
          },
          error: (err) => {
            console.error('Failed to load enrollments:', err);
            events.forEach((e) => (e.isEnrolled = false));
            this.dataSource.data = events;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.snackBar.open('Failed to load events', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  applyFilter() {
    this.dataSource.filter = '' + Math.random(); // triggers filterPredicate
  }

  clearFilter() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.applyFilter();
  }
  onToggleEnroll(event: Event, isChecked: boolean) {
    const action = isChecked
      ? this.eventService.enrollUser(event.event_id, this.currentUserId)
      : this.eventService.cancelEnrollment(event.event_id, this.currentUserId);

    action.subscribe({
      next: () => {
        event.isEnrolled = isChecked;
        const message = isChecked
          ? 'Enrolled successfully'
          : 'Enrollment cancelled';

        this.snackBar.open(message, 'Close', {
          duration: 2000,
          horizontalPosition: 'center', // center horizontally
          verticalPosition: 'top', // top of the screen
        });
      },
      error: (err) => {
        console.error('Enrollment action failed:', err);
        this.snackBar.open('Action failed', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
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
}
