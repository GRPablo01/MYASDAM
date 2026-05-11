import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMatch } from './gestion-match';

describe('GestionMatch', () => {
  let component: GestionMatch;
  let fixture: ComponentFixture<GestionMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
