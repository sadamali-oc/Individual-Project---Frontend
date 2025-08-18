import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { EventButtonComponent } from '../../../components/event-button/event-button.component';

@Component({
  selector: 'app-normal-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    EventButtonComponent,
  ],
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css'],
})
export class NormalUserDashboardComponent implements OnInit {
  isSidebarOpen: boolean = true;
  userId: string = '';
  userName: string = 'User';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        this.userId = storedUserId;
        this.fetchUserName(this.userId);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  fetchUserName(userId: string): void {
    this.http
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe({
        next: (res) => {
          this.userName = res?.name ?? 'User';
          localStorage.setItem(`user_${userId}`, JSON.stringify(res));
        },
        error: () => {
          this.userName = 'User';
        },
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewProfile(): void {
    if (this.userId) {
      this.router.navigate(['/user/profile', this.userId]);
    }
  }

  navigateToDashboard(): void {
    if (this.userId) {
      this.router.navigate(['/user', this.userId, 'dashboard']);
    }
  }

  navigateToEnrolledEvents(): void {
    if (this.userId) {
      this.router.navigate(['/user', this.userId, 'enrolledEvents']);
    }
  }

  handleLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_id');
      localStorage.removeItem(`user_${this.userId}`);
    }
    this.router.navigate(['/auth/login']);
  }
}
