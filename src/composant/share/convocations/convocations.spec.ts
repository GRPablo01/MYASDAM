import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Convocations } from './convocations';

describe('Convocations', () => {
  let component: Convocations;
  let fixture: ComponentFixture<Convocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Convocations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Convocations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
