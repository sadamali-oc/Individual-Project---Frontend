import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

export type UserStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;
  searchTerm = '';

  statusOptions: UserStatus[] = ['Pending', 'Accepted', 'Rejected'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();

    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
      const filterLower = filter.trim().toLowerCase();
      return (
        data.id.toString().includes(filterLower) ||
        data.name.toLowerCase().includes(filterLower) ||
        data.email.toLowerCase().includes(filterLower)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/all/users').subscribe({
      next: (users) => {
        const mappedUsers: PeriodicElement[] = users.map((user) => {
          let status: UserStatus = 'Pending';
          switch (user.status?.toLowerCase()) {
            case 'active':
              status = 'Accepted';
              break;
            case 'inactive':
              status = 'Rejected';
              break;
            case 'pending':
              status = 'Pending';
              break;
          }
          return {
            id: user.user_id,
            name: user.name,
            email: user.email,
            status,
          };
        });

        this.dataSource.data = mappedUsers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeStatus(user: PeriodicElement, newStatus: UserStatus): void {
    let backendStatus = '';
    switch (newStatus) {
      case 'Accepted':
        backendStatus = 'active';
        break;
      case 'Rejected':
        backendStatus = 'inactive';
        break;
      case 'Pending':
        backendStatus = 'pending';
        break;
    }

    this.http
      .patch(`http://localhost:3000/user/status/${user.id}`, {
        status: backendStatus,
      })
      .subscribe({
        next: () => {
          user.status = newStatus;
        },
        error: (err) => console.error('Error updating status:', err),
      });
  }

  viewUser(user: PeriodicElement): void {
    console.log('View user:', user);
  }
}
