import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentChatComponent } from './comment-chat.component';

describe('CommentChatComponent', () => {
  let component: CommentChatComponent;
  let fixture: ComponentFixture<CommentChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
