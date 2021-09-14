import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpressionOfInterestModalComponent } from './expression-of-interest-modal.component';

describe('ExpressionOfInterestModalComponent', () => {
  let component: ExpressionOfInterestModalComponent;
  let fixture: ComponentFixture<ExpressionOfInterestModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionOfInterestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionOfInterestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
