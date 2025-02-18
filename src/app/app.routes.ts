import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { SignUpComponent } from './Pages/sign-up/sign-up.component';
import { EventListComponent } from './Components/profile/event-list/event-list.component';
import { EventFormComponent } from './Components/event-form/event-form.component';
import { DashboardComponent } from './Pages/dashboard/Dashboard.component';
import { LandingComponent } from './Pages/Website/landing/landing.component';
import { UserComponent } from './Pages/user/user.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AdminComponent } from './Components/admin/admin.component';
import { NewuserComponent } from './Components/newuser/newuser.component';
import { NavigationBarComponent } from './Components/navigation-bar/navigation-bar.component';
import { ReportComponent } from './Pages/report/report.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Default route
  { path: 'events', component: EventListComponent },
  { path: 'event/new', component: EventFormComponent },
  { path: 'event/edit/:id', component: EventFormComponent },
  { path: 'login', component: LoginComponent }, // Default route
  { path: 'signup', component: SignUpComponent }, // Default route
  { path: 'dashboard', component: DashboardComponent }, // Default route
  { path: 'users', component: UserComponent }, // Default route
  { path: 'organizer/create-event', component: CreateEventComponent },
  { path: 'admin-page', component: AdminComponent },
  { path: 'new-user-page', component: NewuserComponent  },
  {path:'navigation',component: NavigationBarComponent},
  { path:'report', component:ReportComponent}
];
