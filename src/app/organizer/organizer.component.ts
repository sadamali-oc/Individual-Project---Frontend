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
import { MatSelectModule } from '@angular/material/select';
import { MatCardContent, MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { UserDetailsDialogComponent } from '../components/user-details-dialog/user-details-dialog.component';

export interface PeriodicElement {
  user_id: number; // raw id from backend
  id: number; // mapped id for table
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
    MatCardContent,
    MatCard,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css'],
})
export class OrganizerComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;
  statusOptions: string[] = ['Pending', 'Accepted', 'Rejected'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('OrganizerComponent initialized');

    // Custom filter to check id, name, email fields
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
      const filterValue = filter.trim().toLowerCase();
      return (
        data.id.toString().includes(filterValue) ||
        data.name.toLowerCase().includes(filterValue) ||
        data.email.toLowerCase().includes(filterValue)
      );
    };

    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    console.log('Fetching organizer data...');
    this.http
      .get<PeriodicElement[]>('http://localhost:3000/all/organizers')
      .subscribe({
        next: (data) => {
          console.log('Fetched organizers:', data);
          const normalizedData = data.map((user) => ({
            ...user,
            id: user.user_id, // map user_id to id for table use
            status: this.capitalizeStatus(user.status),
          }));
          console.log('Normalized organizer data:', normalizedData);

          this.dataSource = new MatTableDataSource(normalizedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching organizers:', error);
          this.isLoading = false;
        },
      });
  }

  capitalizeStatus(status: string): string {
    if (!status) return '';
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'Pending';
    if (lower === 'active') return 'Accepted';
    if (lower === 'inactive') return 'Rejected';
    return status;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filter applied:', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDetailsDialog(user: PeriodicElement): void {
    console.log('Opening details dialog for user:', user);
    this.dialog.open(UserDetailsDialogComponent, {
      width: '400px',
      data: user,
    });
  }

  viewUser(user: PeriodicElement): void {
    this.openDetailsDialog(user);
  }

  changeStatus(user: PeriodicElement, newStatus: string): void {
    if (user.status === newStatus) {
      console.log('Status unchanged for user', user.id, ', skipping update');
      return;
    }

    // Map UI status to backend status values
    const statusMap: { [key: string]: string } = {
      Pending: 'pending',
      Accepted: 'active',
      Rejected: 'inactive',
    };

    const normalizedStatus = statusMap[newStatus] || newStatus.toLowerCase();
    console.log(
      `Changing status for user ${user.id} from ${user.status} to ${newStatus} (backend value: ${normalizedStatus})`
    );

    this.http
      .patch(`http://localhost:3000/user/status/${user.id}`, {
        status: normalizedStatus,
      })
      .subscribe({
        next: () => {
          console.log(`Status updated successfully for user ${user.id}`);
          user.status = newStatus;
          // Optional: Refresh table data if needed:
          // this.fetchData();
        },
        error: (err) => {
          console.error(`Failed to update status for user ${user.id}:`, err);
        },
      });
  }
}
