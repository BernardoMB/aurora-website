import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterBillingInfoModalComponent } from './enter-billing-info-modal.component';

describe('EnterBillingInfoModalComponent', () => {
  let component: EnterBillingInfoModalComponent;
  let fixture: ComponentFixture<EnterBillingInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterBillingInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterBillingInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
