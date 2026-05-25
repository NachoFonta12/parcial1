import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hanged } from './hanged';

describe('Hanged', () => {
  let component: Hanged;
  let fixture: ComponentFixture<Hanged>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hanged],
    }).compileComponents();

    fixture = TestBed.createComponent(Hanged);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
