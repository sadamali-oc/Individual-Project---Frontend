import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatChipListbox } from "@angular/material/chips";               // Import CommonModule here

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.css'],
  imports: [
    MatDialogActions,
    MatDialogContent,
    CommonModule,
    MatProgressSpinner,
    MatChipListbox
], // Add CommonModule to imports
  standalone: true,
})
export class EventDetailsDialogComponent {
  onImageError($event: ErrorEvent) {
    throw new Error('Method not implemented.');
  }
  event: any;
  imageLoading: any;
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#1976d2';
      case 'pending':
        return '#ffa000';
      case 'completed':
        return '#388e3c';
      default:
        return '#555';
    }
  }

  getStatusTitle(status: string): string {
    if (!status) return 'Unknown';
    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }
}
