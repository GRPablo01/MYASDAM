import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Param } from './param';

describe('Param', () => {
  let component: Param;
  let fixture: ComponentFixture<Param>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Param]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Param);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
