import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPublicProfileComponent } from './settings-public-profile.component';

describe('SettingsPublicProfileComponent', () => {
  let component: SettingsPublicProfileComponent;
  let fixture: ComponentFixture<SettingsPublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsPublicProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
