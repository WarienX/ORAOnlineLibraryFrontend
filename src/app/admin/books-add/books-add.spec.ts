import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksAdd } from './books-add';

describe('BooksAdd', () => {
  let component: BooksAdd;
  let fixture: ComponentFixture<BooksAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
