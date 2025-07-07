import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';  // <-- Import this!

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule, CommonModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']  // note: plural 'styleUrls'
})
export class EventComponent {
cancelEvent(_t9: any) {
throw new Error('Method not implemented.');
}
  events = [
    {
      id: 1,
      name: 'Tech Conference 2025',
      category: 'Technology',
      startTime: '2025-07-15 09:00 AM',
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'Music Festival',
      category: 'Entertainment',
      startTime: '2025-06-10 05:00 PM',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Art Workshop',
      category: 'Education',
      startTime: '2025-07-01 10:00 AM',
      status: 'Upcoming'
    }
  ];
otherEvents: any;

  
  viewDetails(event: Event) {
    console.log('View details for', event);
  }
}
