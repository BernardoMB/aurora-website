import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseCommunityCardComponent } from './course-community-card.component';

describe('CourseCommunityCardComponent', () => {
  let component: CourseCommunityCardComponent;
  let fixture: ComponentFixture<CourseCommunityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCommunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
