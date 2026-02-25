import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COOKIE } from './cookie';

describe('COOKIE', () => {
  let component: COOKIE;
  let fixture: ComponentFixture<COOKIE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COOKIE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COOKIE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
