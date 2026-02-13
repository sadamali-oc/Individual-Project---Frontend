import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerMainComponent } from './organizer-main.component';

describe('OrganizerMainComponent', () => {
  let component: OrganizerMainComponent;
  let fixture: ComponentFixture<OrganizerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
