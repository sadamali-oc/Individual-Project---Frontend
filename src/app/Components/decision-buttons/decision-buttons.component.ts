import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Added CommonModule back for *ngIf

@Component({
  selector: 'app-decision-buttons',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule], // Added CommonModule to imports
  templateUrl: './decision-buttons.component.html',
  styleUrls: ['./decision-buttons.component.css']
})
export class DecisionButtonsComponent {
  @Input() eventId!: string;
  @Input() status!: 'Approved' | 'Pending' | 'Rejected'; // Updated status type

  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();

  onAccept() {
    this.accept.emit(this.eventId);
  }

  onReject() {
    this.reject.emit(this.eventId);
  }
}
