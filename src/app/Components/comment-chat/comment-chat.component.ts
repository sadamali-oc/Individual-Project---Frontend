import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { EventService } from '../../services/event/event.service';
import { CommentService } from '../../services/comment/comment.service';

interface ChatMessage {
  user_id: number;
  user_name: string;
  message: string;
}

@Component({
  selector: 'app-comment-chat',
  templateUrl: './comment-chat.component.html',
  styleUrls: ['./comment-chat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
})
export class CommentChatComponent implements OnInit, AfterViewChecked {
  messages: ChatMessage[] = [];
  newMessage: string = '';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CommentChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages() {
    this.eventService.getEventMessages(this.data.event_id).subscribe({
      next: (res: ChatMessage[]) => {
        this.messages = res;
        this.scrollToBottom();
      },
      error: (err) => console.error(err),
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const newMsg: ChatMessage = {
      user_id: this.data.user_id,
      user_name: this.data.user_name,
      message: this.newMessage,
    };

    this.messages.push(newMsg);
    this.scrollToBottom();

    this.eventService
      .sendEventMessage(this.data.event_id, {
        message: this.newMessage,
        user_id: this.data.user_id,
      })
      .subscribe({
        next: () => {
          this.newMessage = '';
          // notify EventComponent to increment badge
          this.commentService.notifyNewComment(this.data.event_id);
        },
        error: (err) => console.error(err),
      });
  }

  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }

  close() {
    this.dialogRef.close();
  }
}
