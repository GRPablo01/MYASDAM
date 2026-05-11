import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDay } from './match-day';

describe('MatchDay', () => {
  let component: MatchDay;
  let fixture: ComponentFixture<MatchDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchDay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchDay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
