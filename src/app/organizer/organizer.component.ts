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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  club_name: string;
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
    MatSnackBarModule,
  ],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css'],
})
export class OrganizerComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'club_name',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
        data.status.toLowerCase().includes(filterValue) ||
        data.club_name.toLowerCase().includes(filterValue)
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
          // Normalize the data, ensure club_name is string
          const normalizedData: PeriodicElement[] = data
            .map((user) => ({
              ...user,
              id: user.user_id,
              status: this.normalizeStatus(user.status),
              club_name: user.club_name || 'N/A',
            }))
            // Only show Pending users in table
            .filter((user) => user.status === 'Pending');

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

  normalizeStatus(status: string): string {
    if (!status) return 'Pending';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Accepted';
      case 'inactive':
        return 'Rejected';
      default:
        return this.capitalize(status);
    }
  }

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

  /** --- Accept / Reject users --- */
  acceptUser(user: PeriodicElement) {
    this.changeStatus(user, 'Accepted');
    this.removeUserFromTable(user);
    this.showSuccess(`${user.name} accepted successfully`);
  }

  rejectUser(user: PeriodicElement) {
    this.changeStatus(user, 'Rejected');
    this.removeUserFromTable(user);
    this.showSuccess(`${user.name} rejected successfully`);
  }

  private removeUserFromTable(user: PeriodicElement) {
    const index = this.dataSource.data.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
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
        },
        error: (err) => console.error('Failed to update status', err),
      });
  }

  /** --- Snackbar --- */
  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
