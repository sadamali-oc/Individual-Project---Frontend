import { Component } from '@angular/core';
import { ViewChild, OnInit } from '@angular/core';
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
// import { DecisionButtonsComponent } from '../../components/decision-buttons/decision-buttons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PeriodicElement } from '../components/Admin dashboard/user/user.component';

@Component({
  selector: 'app-organizer',
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
    // DecisionButtonsComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.css',
})
export class OrganizerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading: boolean = true;
  searchTerm: string = ''; // Changed from searchQuery to match HTML
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
    // Set custom filter predicate
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
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
    // Updated mock data for organizations, fitting the PeriodicElement structure
    const mockUsers: PeriodicElement[] = [
      {
        id: 1,
        name: 'Tech Solutions Inc.',
        email: 'info@techsol.com',
        status: 'Pending',
      },
      {
        id: 2,
        name: 'Global Innovations Ltd.',
        email: 'contact@globalinnov.org',
        status: 'Pending',
      },
      {
        id: 3,
        name: 'Creative Minds Studio',
        email: 'hello@creativeminds.net',
        status: 'Pending',
      },
      {
        id: 4,
        name: 'Future Forward Labs',
        email: 'support@futurelabs.co',
        status: 'Pending',
      },
      {
        id: 5,
        name: 'Dynamic Enterprises',
        email: 'admin@dynamicent.com',
        status: 'Pending',
      },
      {
        id: 6,
        name: 'Pioneer Ventures Group',
        email: 'partners@pioneerventures.com',
        status: 'Pending',
      },
      {
        id: 7,
        name: 'Summit Technologies',
        email: 'sales@summittech.biz',
        status: 'Pending',
      },
      {
        id: 8,
        name: 'Horizon Systems Corp.',
        email: 'hr@horizonsys.com',
        status: 'Pending',
      },
      {
        id: 9,
        name: 'Quantum Innovations',
        email: 'info@quantuminnov.com',
        status: 'Pending',
      },
      {
        id: 10,
        name: 'Elite Solutions Group',
        email: 'contact@elitesol.org',
        status: 'Pending',
      },
      {
        id: 11,
        name: 'NextGen Development',
        email: 'dev@nextgen.com',
        status: 'Pending',
      },
      {
        id: 12,
        name: 'Bright Ideas Co.',
        email: 'ideas@brightideas.net',
        status: 'Pending',
      },
      {
        id: 13,
        name: 'Green Earth Foundation',
        email: 'info@greenearth.org',
        status: 'Pending',
      },
      {
        id: 14,
        name: 'Silver Lining Services',
        email: 'support@silverlining.com',
        status: 'Pending',
      },
      {
        id: 15,
        name: 'Everest Consulting',
        email: 'consult@everest.net',
        status: 'Pending',
      },
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
    console.log(
      `Simulating API call to accept user: ${user.name} (ID: ${user.id})`
    );
    const updatedData = this.dataSource.data.map((u) =>
      u.id === user.id ? { ...u, status: 'Accepted' as 'Accepted' } : u
    );
    this.dataSource.data = updatedData;
  }

  rejectUser(user: PeriodicElement): void {
    console.log(
      `Simulating API call to reject user: ${user.name} (ID: ${user.id})`
    );
    const updatedData = this.dataSource.data.map((u) =>
      u.id === user.id ? { ...u, status: 'Rejected' as 'Rejected' } : u
    );
    this.dataSource.data = updatedData;
  }

  viewUser(user: PeriodicElement): void {
    console.log(`Viewing details for user: ${user.name} (ID: ${user.id})`);
  }

  deleteUser(user: PeriodicElement): void {
    console.log(`Deleting user: ${user.name} (ID: ${user.id})`);
    const updatedData = this.dataSource.data.filter((u) => u.id !== user.id);
    this.dataSource.data = updatedData; // Update the dataSource after filtering
  }
}
