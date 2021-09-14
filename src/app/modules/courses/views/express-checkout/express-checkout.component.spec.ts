import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpressCheckoutComponent } from './express-checkout.component';

describe('ExpressCheckoutComponent', () => {
  let component: ExpressCheckoutComponent;
  let fixture: ComponentFixture<ExpressCheckoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
