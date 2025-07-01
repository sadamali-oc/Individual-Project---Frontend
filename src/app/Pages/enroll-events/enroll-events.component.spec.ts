import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollEventsComponent } from './enroll-events.component';

describe('EnrollEventsComponent', () => {
  let component: EnrollEventsComponent;
  let fixture: ComponentFixture<EnrollEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
