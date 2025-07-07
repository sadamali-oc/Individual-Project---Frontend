import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

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
    MatMenuModule
  ],
  templateUrl: './organizer-main.component.html',
  styleUrls: ['./organizer-main.component.css']
})
export class OrganizerMainComponent {
  isSidebarOpen: boolean = true;
  userId: string = '62'; // Ideally load this dynamically

  constructor(private router: Router) {} // ✅ Properly inject Router

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewProfile(): void {
    this.router.navigate(['/user/profile', this.userId]); // ✅ Use actual ID
  }

  handleLogout(): void {
    this.router.navigate(['/auth/login']);
  }
}
