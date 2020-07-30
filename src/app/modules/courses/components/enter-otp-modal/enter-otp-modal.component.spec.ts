import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOtpModalComponent } from './enter-otp-modal.component';

describe('EnterOtpModalComponent', () => {
  let component: EnterOtpModalComponent;
  let fixture: ComponentFixture<EnterOtpModalComponent>;

  beforeEach(async(() => {
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
