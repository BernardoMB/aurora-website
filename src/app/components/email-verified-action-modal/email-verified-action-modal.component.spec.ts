import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifiedActionModalComponent } from './email-verified-action-modal.component';

describe('EmailVerifiedActionModalComponent', () => {
  let component: EmailVerifiedActionModalComponent;
  let fixture: ComponentFixture<EmailVerifiedActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerifiedActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerifiedActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
