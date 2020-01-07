import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCategoryDetailComponent } from './course-category-detail.component';

describe('CourseCategoryDetailComponent', () => {
  let component: CourseCategoryDetailComponent;
  let fixture: ComponentFixture<CourseCategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseCategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
