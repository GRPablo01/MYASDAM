import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Convo } from './convo';

describe('Convo', () => {
  let component: Convo;
  let fixture: ComponentFixture<Convo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Convo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Convo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
