import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllMyCoursesComponent } from './all-my-courses.component';

describe('AllMyCoursesComponent', () => {
  let component: AllMyCoursesComponent;
  let fixture: ComponentFixture<AllMyCoursesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMyCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
