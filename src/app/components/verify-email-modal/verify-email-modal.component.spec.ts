import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifyEmailModalComponent } from './verify-email-modal.component';

describe('VerifyEmailModalComponent', () => {
  let component: VerifyEmailModalComponent;
  let fixture: ComponentFixture<VerifyEmailModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
