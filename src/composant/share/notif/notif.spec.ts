import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notif } from './notif';

describe('Notif', () => {
  let component: Notif;
  let fixture: ComponentFixture<Notif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
