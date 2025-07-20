import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-event',
  standalone: true,
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
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatSnackBarModule,
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent implements OnInit {
  userId: string | null = null;

  eventName: string = '';
  eventDescription: string = '';
  eventDate: Date | string = '';
  startTime: string = '';
  endTime: string = '';
  eventCategory: string | undefined;
  eventNotes: string = '';
  fileName: string = '';
  eventFile: File | null = null;
  status: string = 'upcoming';
  downloadURL: string | null = null;
  isSubmitting: boolean = false;
eventFormLink: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private storage: Storage,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent?.snapshot.paramMap.get('userId') ?? null;
    console.log('User ID:', this.userId);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.eventFile = input.files[0];
      this.fileName = this.eventFile.name;
      console.log('Selected file:', this.fileName);
    }
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async submitForm(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (
      !this.eventName.trim() ||
      !this.eventCategory ||
      !this.startTime.trim() ||
      !this.endTime.trim() ||
      !this.eventDate
    ) {
      this.showError('Please fill in all required fields');
      this.isSubmitting = false;
      return;
    }

    try {
      if (this.eventFile) {
        const filePath = `event_flyers/${Date.now()}_${this.eventFile.name}`;
        const storageRef = ref(this.storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, this.eventFile);
        await uploadTask;
        this.downloadURL = await getDownloadURL(storageRef);
        console.log('File uploaded to Firebase:', this.downloadURL);
      }

      const formattedDate = this.formatDate(this.eventDate);
      const formData = new FormData();
      formData.append('event_name', this.eventName);
      formData.append('description', this.eventDescription);
      formData.append('event_date', formattedDate);
      formData.append('start_time', this.startTime);
      formData.append('end_time', this.endTime);
      formData.append('event_category', this.eventCategory!);
      formData.append('additional_notes', this.eventNotes);
      formData.append('user_id', this.userId || '');

      if (this.downloadURL) {
        formData.append('flyer_image', this.downloadURL);
      }

      if (!this.userId) {
        this.showError('User ID is missing');
        return;
      }

      await this.http
        .post(`http://localhost:3000/add/events/${this.userId}`, formData)
        .toPromise();

      this.showSuccess('Event created successfully!');
      this.resetForm();
    } catch (error) {
      console.error('Error creating event', error);
      this.showError('An error occurred while creating the event');
    } finally {
      this.isSubmitting = false;
    }
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  resetForm(): void {
    this.eventName = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.startTime = '';
    this.endTime = '';
    this.eventCategory = undefined;
    this.eventNotes = '';
    this.status = 'upcoming';
    this.fileName = '';
    this.eventFile = null;
    this.downloadURL = null;
  }
}
