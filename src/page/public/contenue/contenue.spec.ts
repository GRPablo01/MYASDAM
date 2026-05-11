import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contenue } from './contenue';

describe('Contenue', () => {
  let component: Contenue;
  let fixture: ComponentFixture<Contenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
