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
    // TODO: Remove the following line when courses are uploaded having an img url that points to an appropiate image hosting service
    this.course.imgUrl = `/assets/img/courses/course${this.getRandomInteger(1, 16)}.jpg`;
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
