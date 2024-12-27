import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [


    { path: 'login', component: DashboardComponent }, // Default route

    { path: 'login', component: LoginComponent }, // Default route
    { path: 'signup', component: SignUpComponent }, // Default route


];
