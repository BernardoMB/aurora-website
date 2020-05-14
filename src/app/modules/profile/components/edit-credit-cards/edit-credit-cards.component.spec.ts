import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditCardsComponent } from './edit-credit-cards.component';

describe('EditCreditCardsComponent', () => {
  let component: EditCreditCardsComponent;
  let fixture: ComponentFixture<EditCreditCardsComponent>;

  beforeEach(async(() => {
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
