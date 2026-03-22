import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon3 } from './icon3';

describe('Icon3', () => {
  let component: Icon3;
  let fixture: ComponentFixture<Icon3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Icon3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
