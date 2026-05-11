import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConvoque } from './gestion-convoque';

describe('GestionConvoque', () => {
  let component: GestionConvoque;
  let fixture: ComponentFixture<GestionConvoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionConvoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionConvoque);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
