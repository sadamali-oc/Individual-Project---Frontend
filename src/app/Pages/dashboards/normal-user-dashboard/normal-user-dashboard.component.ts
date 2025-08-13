import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NormalUserService } from './normaluser.service';
import { EventButtonComponent } from '../../../components/event-button/event-button.component';

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
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-normal-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule,
    EventButtonComponent,
  ],
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css'],
})
export class NormalUserDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('sidenav') sidenav!: MatSidenav;

  userId: string | null = null;
  name = '';
  isSidebarOpen = true;

  private subscriptions = new Subscription();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private normaluserService: NormalUserService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID in Dashboard:', this.userId);

    if (this.userId) {
      this.subscriptions.add(
        this.normaluserService.getUserProfile(this.userId).subscribe({
          next: (userData: any) => {
            const fetchedName = userData?.name?.trim();
            this.name = fetchedName && fetchedName !== '' ? fetchedName : 'User';
          },
          error: (error: any) => {
            console.error('Error fetching user data:', error);
            this.name = 'User';
          },
        })
      );
    }

    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (this.sidenav) {
          if (result.matches) {
            this.sidenav.mode = 'over';
            this.sidenav.close();
            this.isSidebarOpen = false;
          } else {
            this.sidenav.mode = 'side';
            this.sidenav.open();
            this.isSidebarOpen = true;
          }
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  viewProfile(): void {
    if (this.userId) {
      this.router.navigate(['/user/profile', this.userId]);
    }
  }

  handleLogout(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
