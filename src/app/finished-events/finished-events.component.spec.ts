import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedEventsComponent } from './finished-events.component';

describe('FinishedEventsComponent', () => {
  let component: FinishedEventsComponent;
  let fixture: ComponentFixture<FinishedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
