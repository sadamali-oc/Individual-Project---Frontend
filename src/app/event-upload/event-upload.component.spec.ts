import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-upload',
  templateUrl: './event-upload.component.html',
})
export class EventUploadComponent {
  eventName = '';
  eventDescription = '';
  imageFile: File | null = null;
  uploadProgress = 0;

  constructor(private http: HttpClient) {
    initializeApp(environment.firebaseConfig);
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  uploadEvent() {
    if (!this.eventName || !this.imageFile) {
      alert('Please enter event name and select an image');
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `event-images/${this.imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, this.imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error('Upload error:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Prepare event data with image URL
          const eventData = {
            event_name: this.eventName,
            description: this.eventDescription,
            flyer_image: downloadURL,
          };

          // Send event data to backend API
          this.http.post('http://localhost:3000/events', eventData).subscribe({
            next: () => alert('Event uploaded successfully!'),
            error: (err) => {
              alert('Failed to save event data');
              console.error(err);
            },
          });
        });
      }
    );
  }
}
