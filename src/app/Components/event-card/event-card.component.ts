import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  imports:[
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class EventCardComponent {
  showDetails = false;

  event = {
    title: 'Tech Conference 2025',
    date: new Date('2025-07-05'),
    shortDescription: 'A one-day conference focusing on the latest tech trends.',
    fullDescription: 'Join industry leaders for workshops, panels, and networking at Tech Conference 2025.',
    location: 'Colombo Convention Center',
    contact: 'contact@techconf.com',
  };

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
