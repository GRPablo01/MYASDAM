import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fonctionalite } from './fonctionalite';

describe('Fonctionalite', () => {
  let component: Fonctionalite;
  let fixture: ComponentFixture<Fonctionalite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fonctionalite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fonctionalite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
