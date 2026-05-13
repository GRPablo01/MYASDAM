import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Communiquer } from './communiquer';

describe('Communiquer', () => {
  let component: Communiquer;
  let fixture: ComponentFixture<Communiquer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Communiquer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Communiquer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
