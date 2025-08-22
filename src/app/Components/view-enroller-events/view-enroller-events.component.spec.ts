import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnrollerEventsComponent } from './view-enroller-events.component';

describe('ViewEnrollerEventsComponent', () => {
  let component: ViewEnrollerEventsComponent;
  let fixture: ComponentFixture<ViewEnrollerEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEnrollerEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEnrollerEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
