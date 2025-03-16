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
import { ActivatedRoute } from '@angular/router';

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
  userId: string | null = null;

  eventName: string = '';
  eventDescription: string = '';
  eventDate: string = '';
  startTime: string = '';
  endTime: string = '';
  eventCategory: string | undefined;
  eventNotes: string = '';
  fileName: string = '';
  eventFile: File | null = null;
  status: string = 'upcoming';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      console.log('User ID:', this.userId);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.eventFile = input.files[0];
      this.fileName = this.eventFile.name;
    }
  }

  submitForm(): void {
    console.log('Form submission started');

    if (!this.eventName || !this.eventCategory || !this.startTime || !this.endTime) {
      console.log('Missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('event_name', this.eventName);
    formData.append('description', this.eventDescription);
    formData.append('event_date', this.eventDate);
    formData.append('start_time', this.startTime);
    formData.append('end_time', this.endTime);
    formData.append('event_category', this.eventCategory);
    formData.append('additional_notes', this.eventNotes);
    formData.append('status', this.status);
    formData.append('user_id', this.userId || '');

    if (this.eventFile) {
      formData.append('flyer_image', this.eventFile, this.eventFile.name);
    }

    console.log('Form data prepared', formData);

    if (this.userId) {
      console.log('Sending data to backend for userId:', this.userId);
      this.http.post(`http://localhost:3000/event/add/events/${this.userId}`, formData).subscribe(
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
    } else {
      alert('User ID is missing');
    }
  }

  resetForm(): void {
    this.eventName = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.startTime = '';
    this.endTime = '';
    this.eventCategory = '';
    this.eventNotes = '';
    this.status = 'upcoming';
    this.fileName = '';
    this.eventFile = null;
  }
}
