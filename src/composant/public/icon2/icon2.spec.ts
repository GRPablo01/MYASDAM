import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon2 } from './icon2';

describe('Icon2', () => {
  let component: Icon2;
  let fixture: ComponentFixture<Icon2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Icon2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
