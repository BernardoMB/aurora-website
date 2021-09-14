import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountCardComponent } from './account-card.component';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
