import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewModalComponent } from './review-modal.component';

describe('ReviewModalComponent', () => {
  let component: ReviewModalComponent;
  let fixture: ComponentFixture<ReviewModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
