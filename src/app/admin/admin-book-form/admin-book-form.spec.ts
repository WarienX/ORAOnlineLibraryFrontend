import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookForm } from './admin-book-form';

describe('AdminBookForm', () => {
  let component: AdminBookForm;
  let fixture: ComponentFixture<AdminBookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
