import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COOKIES } from './cookies';

describe('COOKIES', () => {
  let component: COOKIES;
  let fixture: ComponentFixture<COOKIES>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COOKIES]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COOKIES);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
