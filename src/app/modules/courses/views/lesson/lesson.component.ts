import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {

  decryptionKeyToken: string;

  lessonSubscription: Subscription;
  lesson: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.decryptionKeyToken = '';
    this.route.data.subscribe((data: any) => {
      if (data.lesson) {
        this.lesson = data.lesson;
      }
    });
  }
}
