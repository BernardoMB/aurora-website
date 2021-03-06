import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpoReviewComponent } from './ipo-review.component';

describe('IpoReviewComponent', () => {
  let component: IpoReviewComponent;
  let fixture: ComponentFixture<IpoReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpoReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpoReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
