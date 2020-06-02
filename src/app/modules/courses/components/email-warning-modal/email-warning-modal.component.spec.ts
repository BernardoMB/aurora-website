import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailWarningModalComponent } from './email-warning-modal.component';

describe('EmailWarningModalComponent', () => {
  let component: EmailWarningModalComponent;
  let fixture: ComponentFixture<EmailWarningModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailWarningModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
