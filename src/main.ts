import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/Pages/login/login.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
