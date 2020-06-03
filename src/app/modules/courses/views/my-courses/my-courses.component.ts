import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Course } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  currentTab: string;
  recommendedCourses: Course[];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      // console.log('Navigation event:', event);
      if (event instanceof NavigationEnd) {
        ///window.scrollTo(0, 0);
      }
      return;
    });
  }

  ngOnInit() {
    // Get resolved data
    const data = this.route.snapshot.data;
    // console.log('%c Activated route snapshot resolved data ', 'background: #222; color: #bada55');
    // console.log(data);
    if (data.myCoursesInfo) {
      const myCoursesInfo: { recommendedCourses: Course[] } = data.myCoursesInfo;
      this.recommendedCourses = myCoursesInfo.recommendedCourses;
    }
  }
}
