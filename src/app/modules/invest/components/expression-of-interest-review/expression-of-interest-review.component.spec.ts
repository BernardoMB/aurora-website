import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionOfInterestReviewComponent } from './expression-of-interest-review.component';

describe('ExpressionOfInterestReviewComponent', () => {
  let component: ExpressionOfInterestReviewComponent;
  let fixture: ComponentFixture<ExpressionOfInterestReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionOfInterestReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionOfInterestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
