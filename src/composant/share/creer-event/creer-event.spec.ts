import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerEvent } from './creer-event';

describe('CreerEvent', () => {
  let component: CreerEvent;
  let fixture: ComponentFixture<CreerEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
