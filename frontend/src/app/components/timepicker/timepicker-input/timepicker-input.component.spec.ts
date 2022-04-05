import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerInputComponent } from './timepicker-input.component';

describe('TimepickerInputComponent', () => {
  let component: TimepickerInputComponent;
  let fixture: ComponentFixture<TimepickerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimepickerInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
