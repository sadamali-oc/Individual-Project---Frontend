import { Component, OnInit } from '@angular/core';
import { NormalUserService } from '../../pages/dashboards/normal-user-dashboard/normaluser.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';`
import { MatSnackBar } from '@angular/material/snack-bar';`

interface Event {
isParticipating: any;
  description: any;
  event_name: string;
  event_date: string;
  location?: string;
  status: string;
  event_category: string;
  flyer_image?: string;
}

@Component({
  selector: 'app-event-button',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, MatDialogModule,
  MatSlideToggleModule, MatButtonModule,   ], // Add MatDialogModule here
  templateUrl: './event-button.component.html',
  styleUrls: ['./event-button.component.css'],
})
export class EventButtonComponent implements OnInit {
  events: Event[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: NormalUserService,
    private dialog: MatDialog // Inject MatDialog here
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentMonthEvents().subscribe(
      (eventsData) => {
        this.events = eventsData;
        console.log('Current Month Events:', eventsData);
      },
      (error) => {
        console.error('Error fetching current month events:', error);
      }
    );
  }

  // Fix: method signature typo and added return type void
  viewEvent(event: Event): void {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '700px',
      data: event,
    });
  }
}
