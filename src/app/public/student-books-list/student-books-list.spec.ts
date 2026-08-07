import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBooksList } from './student-books-list';

describe('StudentBooksList', () => {
  let component: StudentBooksList;
  let fixture: ComponentFixture<StudentBooksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentBooksList],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentBooksList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
