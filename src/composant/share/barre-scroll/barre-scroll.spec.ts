import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarreScroll } from './barre-scroll';

describe('BarreScroll', () => {
  let component: BarreScroll;
  let fixture: ComponentFixture<BarreScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarreScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarreScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
