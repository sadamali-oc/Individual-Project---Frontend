import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-enroll-events',
  imports: [

    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './enroll-events.component.html',
  styleUrl: './enroll-events.component.css'
})
export class EnrollEventsComponent {

}
