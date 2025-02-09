import { Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  status: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: true },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: false },
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: true },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: false },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: true },{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: true },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: false },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: true },{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: true },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: false },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: true },{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: true },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: false },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: true },{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: true },
  // Add more elements as required
];

@Component({
  selector: 'app-user',
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatPaginatorModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  

  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'status',
  ];
  dataSource = ELEMENT_DATA;
  // Method to handle the button click for each row
  toggleStatus(element: PeriodicElement): void {
    element.status = !element.status; // Toggle the status between true (enabled) and false (disabled)
  }
}
