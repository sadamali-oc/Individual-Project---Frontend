import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-event',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    NgxMatTimepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent {
  eventName: string = '';
  eventDescription: string = '';
  eventDate: string = ''; // Ensure this is bound correctly in the template
  startTime: string = ''; // Bind this in the template
  endTime: string = ''; // Bind this in the template
  eventCategory: string | undefined;
  eventNotes: string = '';
  fileName: string = '';
  eventFile: File | null = null;
  status: string = 'upcoming'; // Default status set to "upcoming"

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.eventFile = input.files[0];
      this.fileName = this.eventFile.name;
    }
  }

  // Handle form submission and send data to backend
  submitForm(): void {
    if (!this.eventName || !this.eventCategory || !this.startTime || !this.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('event_name', this.eventName);
    formData.append('description', this.eventDescription);
    formData.append('event_date', this.eventDate);  // Include the event date
    formData.append('start_time', this.startTime);  // Include the start time
    formData.append('end_time', this.endTime);      // Include the end time
    formData.append('event_category', this.eventCategory);
    formData.append('additional_notes', this.eventNotes);
    formData.append('status', this.status);    // Include the status field with value "upcoming"

    if (this.eventFile) {
      formData.append('flyer_image', this.eventFile, this.eventFile.name);
    }

    // Perform HTTP request to the backend API
    this.http.post('http://localhost:3000/add/event', formData).subscribe(
      (response) => {
        console.log('Event created successfully', response);
        alert('Event created successfully!');
        this.resetForm();
      },
      (error) => {
        console.error('Error creating event', error);
        alert('An error occurred while creating the event');
      }
    );
  }

  // Reset the form
  resetForm(): void {
    this.eventName = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.startTime = '';
    this.endTime = '';
    this.eventCategory = '';
    this.eventNotes = '';
    this.status = 'upcoming'; // Reset status to "upcoming"
    this.fileName = '';
    this.eventFile = null;
  }
}
