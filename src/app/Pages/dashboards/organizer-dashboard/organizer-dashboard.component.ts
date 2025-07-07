import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import {MatDividerModule} from '@angular/material/divider';

interface Event {
  name: string;
  date: string;
  location: string;
  status: string;
}

@Component({
  selector: 'app-organizer-dashboard',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule,
    MatListModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {
  userId: string | null = ''; 
  name: string = 'Guest';  

  upcomingEventsCount: number = 0;
  completedEventsCount: number = 0;
  participantsCount: number = 0;

  events: Event[] = [];  // Dynamic event data

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID in Dashboard:', this.userId);

    // Fetch user data using the UserService
    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe(
        (userData) => {
          this.name = userData.name || 'Guest';  
          console.log('User data:', userData);
        
          this.upcomingEventsCount = userData.upcomingEventsCount;
          this.completedEventsCount = userData.completedEventsCount;
          this.participantsCount = userData.participantsCount;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.name = 'Guest';  
        }
      );

      // Fetch events associated with this user
      // this.userService.getEvent(this.userId).subscribe(
      //   (eventsData) => {
      //     this.events = eventsData;
      //     console.log('User Events:', eventsData);
      //   },
      //   (error) => {
      //     console.error('Error fetching events data:', error);
      //   }
      // );
    }
  }

  goToProfile(): void {
    console.log('Navigating to profile...');
  }

  logout(): void {
    console.log('Logging out...');
  }
}
