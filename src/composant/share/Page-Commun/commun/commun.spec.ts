import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commun } from './commun';

describe('Commun', () => {
  let component: Commun;
  let fixture: ComponentFixture<Commun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commun]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commun);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
