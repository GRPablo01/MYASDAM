import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrer } from './registrer';

describe('Registrer', () => {
  let component: Registrer;
  let fixture: ComponentFixture<Registrer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registrer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
