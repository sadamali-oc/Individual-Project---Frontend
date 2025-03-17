import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NormalUserService } from './normaluser.service';
import { Subscription } from 'rxjs';
import { EventButtonComponent } from "../../../Components/event-button/event-button.component";

interface Event {
  name: string;
  date: string;
  location: string;
  status: string;
}

@Component({
  selector: 'app-normal-user-dashboard',
  standalone: true,
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
    MatDividerModule,
    EventButtonComponent
],
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css'] // Fix: Correct array syntax
})
export class NormalUserDashboardComponent implements OnInit {
  userId: string | null = ''; 
  name: string = 'Guest';  
 
  events: Event[] = []; 
  private subscriptions: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private normaluserService: NormalUserService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID in Dashboard:', this.userId);
  
    if (this.userId) {
      this.subscriptions.add(
        this.normaluserService.getUserProfile(this.userId).subscribe(
          (userData: any) => {
            console.log('User data received:', userData);  // Log the user data
            this.name = userData?.name?.trim() || 'Guest';
            console.log('Name after trim:', this.name);  // Log the trimmed name
          },
          (error: any) => {
            console.error('Error fetching user data:', error);
            this.name = 'Guest';
          }
        )
      );
    }
  }
  

  goToProfile(): void {
    console.log('Navigating to profile...');
  }

  logout(): void {
    console.log('Logging out...');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
