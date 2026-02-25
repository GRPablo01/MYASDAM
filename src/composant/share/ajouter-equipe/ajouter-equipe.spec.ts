import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEquipe } from './ajouter-equipe';

describe('AjouterEquipe', () => {
  let component: AjouterEquipe;
  let fixture: ComponentFixture<AjouterEquipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterEquipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterEquipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
