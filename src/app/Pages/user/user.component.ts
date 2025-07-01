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

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,  // If using icons, like in the buttons

  ],
})
export class UserComponent implements OnInit {
toggleStatus(_t45: any) {
throw new Error('Method not implemented.');
}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'status'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading: boolean = true;
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // Fetch data from API
  fetchData(): void {
    this.isLoading = true; // Start loading

    this.http
      .get<PeriodicElement[]>('http://localhost:3000/all/users')
      .subscribe(
        (data) => {
          this.dataSource.data = data;
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          this.isLoading = false; // Stop loading
        },
        (error) => {
          console.error('Error fetching data', error);
          this.isLoading = false;
        }
      );
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }
}
