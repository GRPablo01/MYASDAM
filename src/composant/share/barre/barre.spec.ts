import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Barre } from './barre';

describe('Barre', () => {
  let component: Barre;
  let fixture: ComponentFixture<Barre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Barre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Barre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
