import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog if you intend to use it for confirmations

// Interface for Event data
export interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  registrations: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

// Mock Event Data (Moved outside the class for cleaner component code)
const MOCK_EVENTS: Event[] = [
  { id: 'e101', name: 'Annual Tech Summit', date: new Date(2025, 7, 15), time: '09:00 AM', location: 'Main Auditorium', registrations: 120, status: 'Approved' },
  { id: 'e102', name: 'Science Fair Showcase', date: new Date(2025, 7, 22), time: '10:00 AM', location: 'Exhibition Hall', registrations: 85, status: 'Approved' },
  { id: 'e103', name: 'Career Day 2025', date: new Date(2025, 8, 5), time: '08:30 AM', location: 'University Gym', registrations: 210, status: 'Pending' },
  { id: 'e104', name: 'Alumni Reunion Gala', date: new Date(2025, 9, 1), time: '06:00 PM', location: 'Grand Ballroom', registrations: 150, status: 'Approved' },
  { id: 'e105', name: 'Student Hackathon', date: new Date(2025, 9, 10), time: '09:00 AM', location: 'Computer Labs', registrations: 60, status: 'Pending' },
  { id: 'e106', name: 'Freshers Orientation', date: new Date(2025, 6, 30), time: '09:00 AM', location: 'Lecture Hall 1', registrations: 300, status: 'Approved' },
  { id: 'e107', name: 'Robotics Workshop', date: new Date(2025, 10, 5), time: '01:00 PM', location: 'Engineering Lab', registrations: 40, status: 'Pending' },
  { id: 'e108', name: 'Literary Festival', date: new Date(2025, 10, 20), time: '03:00 PM', location: 'Library Auditorium', registrations: 90, status: 'Rejected' },
  { id: 'e109', name: 'Coding Challenge', date: new Date(2025, 11, 1), time: '09:00 AM', location: 'IT Building', registrations: 75, status: 'Approved' },
  { id: 'e110', name: 'Annual Sports Meet', date: new Date(2026, 0, 15), time: '08:00 AM', location: 'Sports Complex', registrations: 500, status: 'Approved' },
  { id: 'e111', name: 'Research Symposium', date: new Date(2026, 1, 20), time: '09:30 AM', location: 'Conference Hall', registrations: 110, status: 'Pending' },
];

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
    MatTooltipModule,
    // MatSelectModule // Uncomment if you decide to use mat-select for status change
  ],
  providers: [DatePipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'date', 'location', 'registrations', 'status', 'actions'];
  dataSource = new MatTableDataSource<Event>(MOCK_EVENTS);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // You can inject MatDialog if you plan to use it for more sophisticated confirmation prompts
  constructor(private router: Router /*, private dialog: MatDialog */) { }

  ngOnInit(): void {
    // Data is initialized directly with MOCK_EVENTS.
    // In a real app, you'd fetch data here from a service.
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom sorting accessor for the 'date' column
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date': return item.date.getTime(); // Sort by timestamp for date objects
        default: return (item as any)[property];
      }
    };
  }

  /**
   * Applies a filter to the table data based on user input.
   * @param event The keyboard event from the filter input.
   */
  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Navigates to the event details page.
   * @param eventId The ID of the event to view.
   */
  viewEventDetails(eventId: string): void {
    console.log(`View details for event: ${eventId}`);
    this.router.navigate(['/events', eventId, 'details']);
  }

  /**
   * Navigates to the event edit page.
   * @param eventId The ID of the event to edit.
   */
  editEvent(eventId: string): void {
    console.log(`Edit event: ${eventId}`);
    this.router.navigate(['/events', eventId, 'edit']);
  }

  /**
   * Deletes an event after user confirmation.
   * In a real app, this would also call a backend service.
   * @param eventId The ID of the event to delete.
   */
  deleteEvent(eventId: string): void {
    console.log(`Attempting to delete event: ${eventId}`);
    const confirmDelete = confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (confirmDelete) {
      // Filter out the deleted event and update dataSource immutably
      this.dataSource.data = this.dataSource.data.filter(event => event.id !== eventId);
      console.log(`Event ${eventId} deleted successfully.`);
      // Optionally reset paginator to first page or current page logic
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      console.log(`Deletion of event ${eventId} cancelled.`);
    }
  }

  /**
   * Navigates to the form for adding a new event.
   */
  addNewEvent(): void {
    console.log('Navigating to add new event form');
    this.router.navigate(['/events', 'new']);
  }

  /**
   * Updates the status of an event (e.g., 'Approved', 'Rejected').
   * Includes a confirmation step for 'Rejected' status.
   * In a real app, this would typically involve an API call to a backend service.
   * @param eventId The ID of the event to update.
   * @param newStatus The new status to set ('Approved' or 'Rejected').
   */
  updateEventStatus(eventId: string, newStatus: 'Approved' | 'Rejected'): void {
    const eventToUpdate = this.dataSource.data.find(event => event.id === eventId);

    if (eventToUpdate) {
      let confirmAction = true;
      if (newStatus === 'Rejected') {
        confirmAction = confirm(`Are you sure you want to set event '${eventToUpdate.name}' to 'Rejected'?`);
      }

      if (confirmAction) {
        // Update the status of the specific event
        const updatedEvents = this.dataSource.data.map(event =>
          event.id === eventId ? { ...event, status: newStatus } : event
        );

        // Update the dataSource immutably to trigger Angular's change detection
        this.dataSource.data = updatedEvents;
        console.log(`Event ${eventId} status updated to ${newStatus}.`);

        // If you were interacting with a backend, it would look something like this:
        // this.eventService.updateEventStatus(eventId, newStatus).subscribe(
        //   response => {
        //     console.log('Event status updated successfully in backend', response);
        //     // Optionally, refresh data from backend or update local data more precisely
        //     const index = this.dataSource.data.findIndex(e => e.id === eventId);
        //     if (index > -1) {
        //       this.dataSource.data[index].status = newStatus;
        //       this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
        //     }
        //   },
        //   error => {
        //     console.error('Error updating event status in backend', error);
        //     alert('Failed to update event status. Please try again.');
        //     // Revert local change if backend update fails
        //     this.dataSource.data = [...MOCK_EVENTS]; // Or load from a backup
        //   }
        // );
      } else {
        console.log(`Status update for event ${eventId} to ${newStatus} cancelled.`);
      }
    }
  }
}