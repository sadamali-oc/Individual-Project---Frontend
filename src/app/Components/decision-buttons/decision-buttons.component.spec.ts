import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionButtonsComponent } from './decision-buttons.component';

describe('DecisionButtonsComponent', () => {
  let component: DecisionButtonsComponent;
  let fixture: ComponentFixture<DecisionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
