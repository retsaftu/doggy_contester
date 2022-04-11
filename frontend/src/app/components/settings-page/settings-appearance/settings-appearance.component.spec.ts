import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAppearanceComponent } from './settings-appearance.component';

describe('SettingsAppearanceComponent', () => {
  let component: SettingsAppearanceComponent;
  let fixture: ComponentFixture<SettingsAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsAppearanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
