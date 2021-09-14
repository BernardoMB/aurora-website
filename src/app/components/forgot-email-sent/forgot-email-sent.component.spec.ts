import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ForgotEmailSentComponent } from './forgot-email-sent.component';

describe('ForgotEmailSentComponent', () => {
  let component: ForgotEmailSentComponent;
  let fixture: ComponentFixture<ForgotEmailSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotEmailSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotEmailSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
