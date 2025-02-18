import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgForm } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';


@Component({
  selector: 'app-create-event',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    NgxMatTimepickerModule


  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent {
  eventName: string = '';
  eventDescription: string = '';
  eventDate: string = '';
  eventTime: string = '';
  eventEmail: string = '';
  eventCategory: string = '';
  eventNotes: string = '';


  
  eventForm!: FormGroup;
  selectedFiles: File[] = [];
  previews: string[] = [];
  message: string[] = [];


  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor() {
    // Observing changes in email FormControl to update error message
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  // Function to update error message based on the validation state of the email field
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  // Submit form data (you can extend this to call an API to submit the form)
  submitForm() {
    if (this.email.valid) {
      // Example of handling the submitted data
      console.log({
        eventName: this.eventName,
        eventDescription: this.eventDescription,
        eventDate: this.eventDate,
        eventTime: this.eventTime,
        eventEmail: this.eventEmail,
        eventCategory: this.eventCategory,
        eventNotes: this.eventNotes,
      });
      // You can reset the form or display a success message after submission.
    }
  }

  // Optional: Reset form
  resetForm() {
    this.eventName = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.eventTime = '';
    this.eventEmail = '';
    this.eventCategory = '';
    this.eventNotes = '';
  }

handleFileInputChange() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const fileNameDisplay = document.querySelector('.file-name') as HTMLElement;

  fileInput?.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.textContent = 'No file chosen';
    }
  });
}


  
}
