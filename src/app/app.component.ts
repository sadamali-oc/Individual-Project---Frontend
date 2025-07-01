import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { GalleryComponent } from './Components/gallery/gallery.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, FullCalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-angular-app';
}
