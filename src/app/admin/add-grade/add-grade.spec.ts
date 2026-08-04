import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrade } from './add-grade';

describe('AddGrade', () => {
  let component: AddGrade;
  let fixture: ComponentFixture<AddGrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGrade],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGrade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
