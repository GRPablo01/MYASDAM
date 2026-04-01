import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsMatch } from './cards-match';

describe('CardsMatch', () => {
  let component: CardsMatch;
  let fixture: ComponentFixture<CardsMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
