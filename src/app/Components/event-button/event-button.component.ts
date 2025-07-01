import { Component } from '@angular/core';
import { NormalUserService } from '../../pages/dashboards/normal-user-dashboard/normaluser.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

interface Event {
  name: string;
  date: string;
  location: string;
  status: string;
  event_category :string;
  flyer_image: string
}


@Component({
  selector: 'app-event-button',
  imports: [
MatCardModule
,
CommonModule
  ],
  templateUrl: './event-button.component.html',
  styleUrl: './event-button.component.css'
})
export class EventButtonComponent {

  events: Event[] = [];  // Dynamic event data
 constructor(private route: ActivatedRoute, private userService: NormalUserService) {}

  ngOnInit(): void {
   
   

      // Fetch events associated with this user
      this.userService.getAllEvent().subscribe(
        (eventsData) => {
          this.events = eventsData;
          console.log('User Events:', eventsData);
        },
        (error) => {
          console.error('Error fetching events data:', error);
        }
      );
    }
  }




