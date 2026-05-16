import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerMatch } from './creer-match';

describe('CreerMatch', () => {
  let component: CreerMatch;
  let fixture: ComponentFixture<CreerMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
