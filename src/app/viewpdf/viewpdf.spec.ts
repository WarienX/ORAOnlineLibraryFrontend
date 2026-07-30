import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewpdf } from './viewpdf';

describe('Viewpdf', () => {
  let component: Viewpdf;
  let fixture: ComponentFixture<Viewpdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewpdf],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewpdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
