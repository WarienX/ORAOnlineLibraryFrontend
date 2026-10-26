import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBooksList } from './admin-books-list';

describe('AdminBooksList', () => {
  let component: AdminBooksList;
  let fixture: ComponentFixture<AdminBooksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBooksList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBooksList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
