import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.css'],
  imports: [
 
    MatDialogContent,
    CommonModule,
    MatIcon,
  
  ],
  standalone: true,
})
export class EventDetailsDialogComponent {
  safeEventFormLink: SafeUrl | null = null;

  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    if (data?.event_form_link) {
      const cleanedLink = data.event_form_link.trim();
      this.safeEventFormLink =
        this.sanitizer.bypassSecurityTrustUrl(cleanedLink);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#1976d2';
      case 'pending':
        return '#ffcc00';
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
