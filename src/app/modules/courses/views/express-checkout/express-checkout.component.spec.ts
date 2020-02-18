import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressCheckoutComponent } from './express-checkout.component';

describe('ExpressCheckoutComponent', () => {
  let component: ExpressCheckoutComponent;
  let fixture: ComponentFixture<ExpressCheckoutComponent>;

  beforeEach(async(() => {
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
