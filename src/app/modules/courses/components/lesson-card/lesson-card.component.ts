import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
})
export class LessonCardComponent implements OnInit {
  @Input() lesson;
  @Input() lessonNumber;

  constructor() {}

  ngOnInit() {}
}
