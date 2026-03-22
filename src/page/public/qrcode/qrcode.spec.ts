import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCode } from './qrcode';

describe('QRCode', () => {
  let component: QRCode;
  let fixture: ComponentFixture<QRCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
