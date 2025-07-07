import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecisionButtonsComponent } from '../../components/decision-buttons/decision-buttons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    DecisionButtonsComponent,
    MatProgressSpinnerModule
  ],
})
export class UserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'status','actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading: boolean = true;
  searchTerm: string = ''; // Changed from searchQuery to match HTML

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
    // Set custom filter predicate
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.id.toString().includes(searchTerm) ||
        data.name.toLowerCase().includes(searchTerm) ||
        data.email.toLowerCase().includes(searchTerm)
      );
    };
  }

  fetchData(): void {
    this.isLoading = true;
    const mockUsers: PeriodicElement[] = [
      { id: 1, name: 'Alice Smith', email: 'alice.s@example.com', status: 'Pending' },
      { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com', status: 'Pending' },
      { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', status: 'Pending' },
      { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', status: 'Pending' },
      { id: 5, name: 'Eve Adams', email: 'eve.a@example.com', status: 'Pending' },
      { id: 6, name: 'Frank White', email: 'frank.w@example.com', status: 'Pending' },
      { id: 7, name: 'Grace Kelly', email: 'grace.k@example.com', status: 'Pending' },
      { id: 8, name: 'Harry Potter', email: 'harry.p@example.com', status: 'Pending' },
      { id: 9, name: 'Ivy Green', email: 'ivy.g@example.com', status: 'Pending' },
      { id: 10, name: 'Jack Black', email: 'jack.b@example.com', status: 'Pending' },
      { id: 11, name: 'Karen Red', email: 'karen.r@example.com', status: 'Pending' },
      { id: 12, name: 'Liam Blue', email: 'liam.b@example.com', status: 'Pending' },
    ];

    setTimeout(() => {
      this.dataSource.data = mockUsers;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
    }, 500);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to first page on filter
    }
  }

  acceptUser(user: PeriodicElement): void {
    console.log(`Simulating API call to accept user: ${user.name} (ID: ${user.id})`);
    const updatedData = this.dataSource.data.map(u =>
      u.id === user.id ? { ...u, status: 'Accepted' as 'Accepted' } : u
    );
    this.dataSource.data = updatedData;
  }

  rejectUser(user: PeriodicElement): void {
    console.log(`Simulating API call to reject user: ${user.name} (ID: ${user.id})`);
    const updatedData = this.dataSource.data.map(u =>
      u.id === user.id ? { ...u, status: 'Rejected' as 'Rejected' } : u
    );
    this.dataSource.data = updatedData;
  }

  viewUser(user: PeriodicElement): void {
    console.log(`Viewing details for user: ${user.name} (ID: ${user.id})`);
  }

  deleteUser(user: PeriodicElement): void {
    console.log(`Deleting user: ${user.name} (ID: ${user.id})`);
    const updatedData = this.dataSource.data.filter(u => u.id !== user.id);
    this.dataSource.data = updatedData;
  }
}