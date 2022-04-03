import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestItemComponent } from './contest-item.component';

describe('ContestItemComponent', () => {
  let component: ContestItemComponent;
  let fixture: ComponentFixture<ContestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
