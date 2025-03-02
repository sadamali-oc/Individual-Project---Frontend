import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-organizer-dashboard',
  imports: [  MatToolbarModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatSidenavModule,
      RouterModule,
      MatListModule,
      MatListModule,
      CommonModule,
      MatCardModule,
      MatTableModule,
      MatChipsModule,
      
    ],
  templateUrl: './organizer-dashboard.component.html',
  styleUrl: './organizer-dashboard.component.css'
})
export class OrganizerDashboardComponent {
userId: any|string;
upcomingEventsCount: any;
completedEventsCount: any;
participantsCount: any;
goToProfile() {
throw new Error('Method not implemented.');
}
logout() {
throw new Error('Method not implemented.');
}


  events = [
    { name: 'Tech Conference', date: '2024-07-15', location: 'Colombo', status: 'Upcoming' },
    { name: 'Hackathon', date: '2024-08-10', location: 'Moratuwa', status: 'Upcoming' },
    { name: 'Music Fest', date: '2024-06-30', location: 'Kandy', status: 'Completed' }
  ];
userProfile: any;



}
