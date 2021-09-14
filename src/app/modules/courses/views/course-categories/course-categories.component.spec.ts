import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseCategoriesComponent } from './course-categories.component';

describe('CourseCategoriesComponent', () => {
  let component: CourseCategoriesComponent;
  let fixture: ComponentFixture<CourseCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
