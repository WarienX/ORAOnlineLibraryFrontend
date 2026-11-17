import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockParentDashboard } from './unlock-parent-dashboard';

describe('UnlockParentDashboard', () => {
  let component: UnlockParentDashboard;
  let fixture: ComponentFixture<UnlockParentDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockParentDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(UnlockParentDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
