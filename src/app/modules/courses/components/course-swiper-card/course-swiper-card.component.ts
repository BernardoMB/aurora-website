import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-swiper-card',
  templateUrl: './course-swiper-card.component.html',
  styleUrls: ['./course-swiper-card.component.scss']
})
export class CourseSwiperCardComponent implements OnInit {
  @Input() course: Course;
  get finalPrice() {
    return this.course.price * (1 - this.course.discount);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
