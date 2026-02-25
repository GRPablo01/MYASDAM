import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDate1 } from './section-date1';

describe('SectionDate1', () => {
  let component: SectionDate1;
  let fixture: ComponentFixture<SectionDate1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionDate1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionDate1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
