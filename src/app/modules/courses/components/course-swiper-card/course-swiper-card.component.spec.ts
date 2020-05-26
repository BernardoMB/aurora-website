import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSwiperCardComponent } from './course-swiper-card.component';

describe('CourseSwiperCardComponent', () => {
  let component: CourseSwiperCardComponent;
  let fixture: ComponentFixture<CourseSwiperCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSwiperCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSwiperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
