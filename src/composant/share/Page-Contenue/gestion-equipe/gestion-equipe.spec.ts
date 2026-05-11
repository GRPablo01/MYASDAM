import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEquipe } from './gestion-equipe';

describe('GestionEquipe', () => {
  let component: GestionEquipe;
  let fixture: ComponentFixture<GestionEquipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEquipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEquipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
