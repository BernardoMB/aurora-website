import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-course-swiper-card',
  templateUrl: './course-swiper-card.component.html',
  styleUrls: ['./course-swiper-card.component.scss']
})
export class CourseSwiperCardComponent implements OnInit {
  @Input() course;

  constructor() { }

  ngOnInit(): void {
  }

}
