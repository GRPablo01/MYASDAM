import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gest } from './gest';

describe('Gest', () => {
  let component: Gest;
  let fixture: ComponentFixture<Gest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
