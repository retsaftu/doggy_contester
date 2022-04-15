import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestAboutComponent } from './contest-about.component';

describe('ContestAboutComponent', () => {
  let component: ContestAboutComponent;
  let fixture: ComponentFixture<ContestAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
