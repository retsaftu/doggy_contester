import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestLeaderboardComponent } from './contest-leaderboard.component';

describe('ContestLeaderboardComponent', () => {
  let component: ContestLeaderboardComponent;
  let fixture: ComponentFixture<ContestLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestLeaderboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
