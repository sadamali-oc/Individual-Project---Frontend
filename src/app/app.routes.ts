// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Auth pages
import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

// Website / landing
import { LandingComponent } from './pages/Website/landing/landing.component';

// User profile
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
//

// Admin dashboard components
import { AdminComponent } from './pages/dashboards/admin/admin.component';
import { DashboardComponent } from './components//admin components/dashboard/dashboard.component';
import { ReportComponent } from './components/admin components/report/report.component';
import { EventListComponent } from './components/profile/event-list/event-list.component';
import { UserComponent } from './components/admin components/user/user.component';
import { OrganizerComponent } from './organizer/organizer.component';

// Organizer dashboard components
import { OrganizerMainComponent } from './components/organizer-main/organizer-main.component';
import { OrganizerDashboardComponent } from './pages/dashboards/organizer-dashboard/organizer-dashboard.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventComponent } from './components/event/event.component';
import { FinishedEventsComponent } from './finished-events/finished-events.component';

// Normal user dashboard components
import { NormalUserDashboardComponent } from './pages/dashboards/normal-user-dashboard/normal-user-dashboard.component';
import { NewuserComponent } from './components/newuser/newuser.component';
import { EnrollEventsComponent } from './pages/enroll-events/enroll-events.component';
import { ViewEnrollerEventsComponent } from './components/view-enroller-events/view-enroller-events.component';
import { SettingComponent } from './components/setting/setting.component';

import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  // Landing page
  { path: '', component: LandingComponent },

  // Auth pages
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignUpComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },

  {
    path: 'user/profile/:userId',
    component: UserProfileComponent,
  },

  { path: 'settings', component: SettingComponent },

  { path: 'eventCalendar', component: CalendarComponent },

  // Admin dashboard
  {
    path: 'admin/:userId',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'events', component: EventListComponent },
      { path: 'attendees', component: UserComponent },
      { path: 'organizers', component: OrganizerComponent },
    ],
  },

  // Organizer dashboard
  {
    path: 'organizer/:userId',
    component: OrganizerMainComponent,
    children: [
      { path: 'dashboard', component: OrganizerDashboardComponent },
      { path: 'event', component: CreateEventComponent },
      { path: 'events', component: EventComponent },
      { path: 'finish-events', component: FinishedEventsComponent },
    ],
  },

  // Normal user dashboard
  {
    path: 'user/:userId',
    component: NormalUserDashboardComponent,
    children: [
      { path: 'dashboard', component: NewuserComponent },
      { path: 'viewEvents', component: EnrollEventsComponent },
      { path: 'enrolledEvents', component: ViewEnrollerEventsComponent },
    ],
  },
];
