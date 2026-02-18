import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actualite } from './actualite';

describe('Actualite', () => {
  let component: Actualite;
  let fixture: ComponentFixture<Actualite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actualite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actualite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
