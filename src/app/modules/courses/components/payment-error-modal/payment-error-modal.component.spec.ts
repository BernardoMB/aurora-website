import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentErrorModalComponent } from './payment-error-modal.component';

describe('PaymentErrorModalComponent', () => {
  let component: PaymentErrorModalComponent;
  let fixture: ComponentFixture<PaymentErrorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
