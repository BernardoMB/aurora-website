import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnterOtpModalComponent } from './enter-otp-modal.component';

describe('EnterOtpModalComponent', () => {
  let component: EnterOtpModalComponent;
  let fixture: ComponentFixture<EnterOtpModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterOtpModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterOtpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
