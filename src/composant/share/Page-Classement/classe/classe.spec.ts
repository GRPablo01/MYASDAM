import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Classe } from './classe';

describe('Classe', () => {
  let component: Classe;
  let fixture: ComponentFixture<Classe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Classe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Classe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
