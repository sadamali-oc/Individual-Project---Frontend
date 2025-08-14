import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { EventListComponent } from './components/profile/event-list/event-list.component';
import { DashboardComponent } from '../app/components/Admin dashboard/dashboard/Dashboard.component';
import { LandingComponent } from './pages/Website/landing/landing.component';
import { UserComponent } from './components/Admin dashboard/user/user.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { NewuserComponent } from './components/newuser/newuser.component';
import { ReportComponent } from '../app/components/Admin dashboard/report/report.component';
import { OrganizerDashboardComponent } from './pages/dashboards/organizer-dashboard/organizer-dashboard.component';
import { NormalUserDashboardComponent } from './pages/dashboards/normal-user-dashboard/normal-user-dashboard.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EnrollEventsComponent } from './pages/enroll-events/enroll-events.component';
import { Routes } from '@angular/router';
import { AdminComponent } from '../app/pages/dashboards/admin/admin.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { OrganizerMainComponent } from './components/organizer-main/organizer-main.component';
import { EventComponent } from './components/event/event.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { FinishedEventsComponent } from './finished-events/finished-events.component';

export const routes: Routes = [
  //landing page
  { path: '', component: LandingComponent },

  //auth pages
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignUpComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { path: 'user/profile/:userId', component: UserProfileComponent },

  //admin dashboard routes
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

  //organizer dashboard routes
  {
    path: 'organizer/:userId',
    component: OrganizerMainComponent,
    children: [
      { path: 'dashboard', component: OrganizerDashboardComponent },
      { path: 'event', component: CreateEventComponent },
      { path: 'events', component: EventComponent },
      {path: 'finish-events', component:FinishedEventsComponent},
    ],
  },

  {
    path: 'user/:userId',
    component: NormalUserDashboardComponent,
    children: [
      { path: 'dashboard', component: NewuserComponent },
      { path: 'enrolledEvents', component: EnrollEventsComponent },
    ],
  },

  //   { path: 'new-user-page', component: NewuserComponent },
  //   { path: 'user/dashboard/:userId', component: NormalUserDashboardComponent },
  //   { path: 'user/profile/:userid', component: UserProfileComponent },
  //   { path: 'enrolledEvents/:userid', component: EnrollEventsComponent },
];






  // { path: 'user/:userID', component: NewuserComponent,
  //   children: [
  //       { path: 'dashboard', component: NormalUserDashboardComponent },
  // { path: 'user/profile/:userid', component: UserProfileComponent },
  // { path: 'enrolledEvents/:userid', component: EnrollEventsComponent },

  //   ]
  //  },
