import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEvent } from './gestion-event';

describe('GestionEvent', () => {
  let component: GestionEvent;
  let fixture: ComponentFixture<GestionEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
