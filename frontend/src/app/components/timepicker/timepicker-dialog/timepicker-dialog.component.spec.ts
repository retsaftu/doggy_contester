import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerDialogComponent } from './timepicker-dialog.component';

describe('TimepickerDialogComponent', () => {
  let component: TimepickerDialogComponent;
  let fixture: ComponentFixture<TimepickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimepickerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
