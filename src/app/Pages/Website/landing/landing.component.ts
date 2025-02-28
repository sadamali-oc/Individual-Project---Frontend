import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GalleryComponent } from '../../../Components/gallery/gallery.component';



interface Event {
  name: string;
  date: string;
  location: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    GalleryComponent
]

  
})
export class LandingComponent {

  eventName: string = '';
  eventDate: string = '';
  eventLocation: string = '';
  
  events: Event[] = [];
  displayedColumns: string[] = ['name', 'date', 'location', 'action'];

  addEvent() {
    if (this.eventName && this.eventDate && this.eventLocation) {
      const newEvent: Event = {
        name: this.eventName,
        date: this.eventDate,
        location: this.eventLocation
      };
      this.events.push(newEvent);
      this.eventName = '';
      this.eventDate = '';
      this.eventLocation = '';
    }
  }

  deleteEvent(event: Event) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }




}
