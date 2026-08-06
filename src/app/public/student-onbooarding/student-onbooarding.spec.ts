import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOnbooarding } from './student-onbooarding';

describe('StudentOnbooarding', () => {
  let component: StudentOnbooarding;
  let fixture: ComponentFixture<StudentOnbooarding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentOnbooarding],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentOnbooarding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
