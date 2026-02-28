import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDate2 } from './section-date2';

describe('SectionDate2', () => {
  let component: SectionDate2;
  let fixture: ComponentFixture<SectionDate2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionDate2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionDate2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
