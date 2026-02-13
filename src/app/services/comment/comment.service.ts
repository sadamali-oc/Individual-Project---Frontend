import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private newCommentSource = new Subject<{ event_id: number }>();
  newComment$ = this.newCommentSource.asObservable();

  notifyNewComment(event_id: number) {
    this.newCommentSource.next({ event_id });
  }
}
