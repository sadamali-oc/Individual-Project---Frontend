import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-organizer-main',
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
  ],
  templateUrl: './organizer-main.component.html',
  styleUrls: ['./organizer-main.component.css'],
})
export class OrganizerMainComponent implements OnInit {
  isSidebarOpen: boolean = true;
  userId: string = '';
  userName: string = 'Dashboard';

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
      }
    }
  }

  fetchUserName(userId: string): void {
    this.http
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe({
        next: (res) => {
          this.userName = res?.name ?? 'Dashboard';
        },
        error: () => {
          this.userName = 'Dashboard';
        },
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewProfile(): void {
    this.router.navigate(['/user/profile', this.userId]);
  }

  handleLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.router.navigate(['/auth/login']);
  }
}
