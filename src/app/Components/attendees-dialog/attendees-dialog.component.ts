import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-attendees-dialog',
  templateUrl: './attendees-dialog.component.html',
  styleUrls: ['./attendees-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
})
export class AttendeesDialogComponent implements OnInit {
  attendees: any[] = [];
  displayedColumns: string[] = ['name', 'email'];

  constructor(
    public dialogRef: MatDialogRef<AttendeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { event_id: number; event_name: string },
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadAttendees();
  }

  loadAttendees() {
    this.eventService.getEventEnrollments(this.data.event_id).subscribe({
      next: (res) => {
        this.attendees = res;
      },
      error: (err) => {
        console.error('Failed to load attendees:', err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
