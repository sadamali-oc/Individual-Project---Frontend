import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBasicExampleComponent } from './table-basic-example.component';

describe('TableBasicExampleComponent', () => {
  let component: TableBasicExampleComponent;
  let fixture: ComponentFixture<TableBasicExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBasicExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBasicExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
