import { Component, OnInit, Input } from '@angular/core';
import { Reaction } from '../../models/community-interaction';
import { Course } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-community-card',
  templateUrl: './course-community-card.component.html',
  styleUrls: ['./course-community-card.component.scss'],
})
export class CourseCommunityCardComponent implements OnInit {
  @Input() set reaction(val: Reaction) {
    this.course = ((val.data as any).course as unknown) as Course;
  }
  course: Course;
  constructor() {}

  ngOnInit(): void {}
}
