import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cont } from './cont';

describe('Cont', () => {
  let component: Cont;
  let fixture: ComponentFixture<Cont>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cont]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cont);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
