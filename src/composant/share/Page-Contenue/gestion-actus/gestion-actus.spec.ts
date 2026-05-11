import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActus } from './gestion-actus';

describe('GestionActus', () => {
  let component: GestionActus;
  let fixture: ComponentFixture<GestionActus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionActus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionActus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
