import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { UserDetailsDialogComponent } from '../components/user-details-dialog/user-details-dialog.component';

export interface PeriodicElement {
  user_id: number;
  id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | string;
  phone_number?: string;
  gender?: string;
  role?: string;
}

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
  ],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css'],
})
export class OrganizerComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
      const filterValue = filter.trim().toLowerCase();
      return (
        data.id.toString().includes(filterValue) ||
        data.name.toLowerCase().includes(filterValue) ||
        data.email.toLowerCase().includes(filterValue) ||
        data.status.toLowerCase().includes(filterValue)
      );
    };
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.http
      .get<PeriodicElement[]>('http://localhost:3000/all/organizers')
      .subscribe({
        next: (data) => {
          const normalizedData = data.map((user) => ({
            ...user,
            id: user.user_id,
            status: this.normalizeStatus(user.status),
          }));
          this.dataSource = new MatTableDataSource(normalizedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching organizers:', err);
          this.isLoading = false;
        },
      });
  }

  /**
   * Normalize API status → UI status
   */
  normalizeStatus(status: string): string {
    if (!status) return 'Pending';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Accepted'; // map backend "active" → UI "Accepted"
      case 'inactive':
        return 'Rejected'; // map backend "inactive" → UI "Rejected"
      default:
        return this.capitalize(status);
    }
  }

  /**
   * UI status → API status
   */
  toApiStatus(uiStatus: string): string {
    switch (uiStatus) {
      case 'Accepted':
        return 'active';
      case 'Rejected':
        return 'inactive';
      case 'Pending':
        return 'pending';
      default:
        return uiStatus.toLowerCase();
    }
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Accepted':
        return '#0a1f44'; // dark blue
      case 'Rejected':
        return '#d32f2f'; // red
      case 'Pending':
        return '#ffa000'; // amber
      default:
        return '#9e9e9e';
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  applyStatusFilter(status: string): void {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) =>
      !filter || data.status.toLowerCase() === filter.toLowerCase();
    this.dataSource.filter = status;
  }

  viewUser(user: PeriodicElement): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '400px',
      data: user,
    });
  }

  changeStatus(user: PeriodicElement, newStatus: string): void {
    if (user.status === newStatus) return;

    const apiStatus = this.toApiStatus(newStatus);

    this.http
      .patch(`http://localhost:3000/user/status/${user.id}`, {
        status: apiStatus,
      })
      .subscribe({
        next: () => {
          user.status = newStatus;
          this.dataSource.data = [...this.dataSource.data]; // refresh UI
        },
        error: (err) => console.error('Failed to update status', err),
      });
  }
}
