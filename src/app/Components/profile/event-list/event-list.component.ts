import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecisionButtonsComponent } from '../../decision-buttons/decision-buttons.component';
import { EventCardComponent } from '../../event-card/event-card.component';
import { EventDetailsDialogComponent } from '../../event-details-dialog/event-details-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

export interface Event {
  event_id: string;
  event_name: string;
  event_date: string | Date; // API may return string
  location: string;
  registrations: number;
  status: 'active' | 'pending' | 'inactive'; // 'rejected' mapped to 'inactive'
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    HttpClientModule,
    MatSnackBarModule,
    DecisionButtonsComponent,
    EventCardComponent,
  ],
  providers: [DatePipe],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'event_id',
    'event_name',
    'event_date',
    'location',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Event>([]);
  isLoading = true;
  filterTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly API_URL = 'http://localhost:3000';
  private readonly snackConfig = {
    duration: 3000,
    verticalPosition: 'top' as const,
    horizontalPosition: 'center' as const,
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadEvents();

    this.dataSource.filterPredicate = (data: Event, filter: string) => {
      const f = filter.trim().toLowerCase();
      return (
        data.event_name.toLowerCase().includes(f) ||
        data.location.toLowerCase().includes(f)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) =>
      property === 'event_date'
        ? new Date(item.event_date).getTime()
        : (item as any)[property];
  }

  applyFilter(event: KeyboardEvent): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterTerm = value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  clearFilter(): void {
    this.filterTerm = '';
    this.dataSource.filter = '';
    this.dataSource.paginator?.firstPage();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.http.get<Event[]>(`${this.API_URL}/organizer-events`).subscribe({
      next: (events) => {
        // Ensure event_date is a Date object
        this.dataSource.data = events.map((e) => ({
          ...e,
          event_date: new Date(e.event_date),
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events', err);
        this.snackBar.open('Failed to load events', 'Close', this.snackConfig);
        this.isLoading = false;
      },
    });
  }

  viewDetails(event: Event): void {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }

  deleteEvent(event: Event): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete "${event.event_name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(`${this.API_URL}/events/${event.event_id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (e) => e.event_id !== event.event_id
          );
          this.snackBar.open('Event deleted', 'Close', this.snackConfig);
        },
        error: () => {
          this.snackBar.open(
            'Failed to delete event',
            'Close',
            this.snackConfig
          );
        },
      });
    });
  }

  updateEventStatus(event: Event, newStatus: 'active' | 'rejected'): void {
    const dbStatus: 'active' | 'inactive' | 'pending' =
      newStatus === 'rejected' ? 'inactive' : newStatus;

    this.http
      .put(`${this.API_URL}/event-status/${event.event_id}`, {
        status: dbStatus,
      })
      .subscribe({
        next: () => {
          event.status = dbStatus;
          this.snackBar.open(
            `Event status updated to ${this.displayStatus(dbStatus)}`,
            'Close',
            this.snackConfig
          );
        },
        error: (err) => {
          console.error('Error updating status', err);
          this.snackBar.open(
            'Failed to update status',
            'Close',
            this.snackConfig
          );
        },
      });
  }

  addNewEvent(): void {
    this.router.navigate(['/events', 'new']);
  }

  displayStatus(status: string): string {
    switch (status) {
      case 'active':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'inactive':
        return 'Rejected';
      default:
        return status;
    }
  }

  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') || '';
  }
}
