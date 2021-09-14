import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCreditCardsComponent } from './edit-credit-cards.component';

describe('EditCreditCardsComponent', () => {
  let component: EditCreditCardsComponent;
  let fixture: ComponentFixture<EditCreditCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreditCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
