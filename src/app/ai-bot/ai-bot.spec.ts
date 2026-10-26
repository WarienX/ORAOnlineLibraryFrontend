import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiBot } from './ai-bot';

describe('AiBot', () => {
  let component: AiBot;
  let fixture: ComponentFixture<AiBot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiBot],
    }).compileComponents();

    fixture = TestBed.createComponent(AiBot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
