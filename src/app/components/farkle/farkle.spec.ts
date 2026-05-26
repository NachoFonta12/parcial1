import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farkle } from './farkle';

describe('Farkle', () => {
  let component: Farkle;
  let fixture: ComponentFixture<Farkle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farkle],
    }).compileComponents();

    fixture = TestBed.createComponent(Farkle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
