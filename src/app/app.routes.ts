import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { EventListComponent } from './components/profile/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { DashboardComponent } from './pages/dashboards/Admin dashboard/dashboard/Dashboard.component';
import { LandingComponent } from './pages/Website/landing/landing.component';
import { UserComponent } from './pages/user/user.component';
import { CreateEventComponent } from './create-event/create-event.component';
// import { AdminComponent } from './components/admin/admin.component';
import { NewuserComponent } from './components/newuser/newuser.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { ReportComponent } from './pages/dashboards/Admin dashboard/report/report.component';
import { OrganizerDashboardComponent } from './pages/dashboards/organizer-dashboard/organizer-dashboard.component';
import { NormalUserDashboardComponent } from './pages/dashboards/normal-user-dashboard/normal-user-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { GalleryComponent } from './Components/gallery/gallery.component';
import { EnrollEventsComponent } from './pages/enroll-events/enroll-events.component';
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { OrganizerMainComponent } from './components/organizer-main/organizer-main.component';
import { EventComponent } from './components/event/event.component';

export const routes: Routes = [
  //landing page
  { path: '', component: LandingComponent }, // Default route

  //login
  { path: 'auth/login', component: LoginComponent },

  { path: 'event/new', component: EventFormComponent },

  { path: 'event/edit/:id', component: EventFormComponent },

  { path: 'auth/signup', component: SignUpComponent }, // Default route
  { path: 'users', component: UserComponent }, // Default route
  // { path: 'organizer/create-event/:userId', component: CreateEventComponent },
  // { path: 'admin-page', component: AdminComponent },
  { path: 'new-user-page', component: NewuserComponent },
  { path: 'navigation', component: NavigationBarComponent },

  { path: 'user/dashboard/:userId', component: NormalUserDashboardComponent },

  { path: 'user/profile/:userid', component: UserProfileComponent },
  
  // { path: 'signup', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'gallery', component: GalleryComponent },
  // { path: 'profile', component: UserProfileComponent },
  { path: 'enrolledEvents/:userid', component: EnrollEventsComponent },

  
  // Admin dashboard layout (sidebar + nested content)
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


    {
    path: 'organizer/:userId',
    component: OrganizerMainComponent,
    children: [
      { path: 'dashboard', component: OrganizerDashboardComponent },
      { path: 'event', component: CreateEventComponent},
      {path: 'events', component: EventComponent },
  

    ],
  },
];
