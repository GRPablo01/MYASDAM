import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerActus } from './creer-actus';

describe('CreerActus', () => {
  let component: CreerActus;
  let fixture: ComponentFixture<CreerActus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerActus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerActus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
