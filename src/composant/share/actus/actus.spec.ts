import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actus } from './actus';

describe('Actus', () => {
  let component: Actus;
  let fixture: ComponentFixture<Actus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
