import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Make sure you've installed AngularFire
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File): Observable<any> {
    const filePath = `eventFlyers/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    
    // Return an observable with progress data (optional)
    return task.snapshotChanges().pipe(
      map(snapshot => {
        if (!snapshot) {
          return { percentage: 0, status: 'undefined' };
        }
        return {
          percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          status: snapshot.state
        };
      }),
      catchError(error => {
        console.error('Error uploading file:', error);
        throw error; // Rethrow or handle the error as needed
      })
    );
  }

  getImageUrl(fileName: string): Observable<string> {
    const fileRef = this.storage.ref(`eventFlyers/${fileName}`);
    return fileRef.getDownloadURL().pipe(
      catchError(error => {
        console.error('Error getting file URL:', error);
        throw error; // Handle errors if the URL retrieval fails
      })
    );
  }
}
