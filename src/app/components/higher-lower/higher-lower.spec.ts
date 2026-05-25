import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherLower } from './higher-lower';

describe('HigherLower', () => {
  let component: HigherLower;
  let fixture: ComponentFixture<HigherLower>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HigherLower],
    }).compileComponents();

    fixture = TestBed.createComponent(HigherLower);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
