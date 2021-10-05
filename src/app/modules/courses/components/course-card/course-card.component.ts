import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-course-card',
    templateUrl: './course-card.component.html',
    styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent implements OnInit {
    @Input() course;

    constructor() { }
    
    ngOnInit() {
        // TODO: Remove the following line when courses are uploaded having an img url that points to an appropiate image hosting service
        this.course.imgUrl = `/assets/img/courses/course${this.getRandomInteger(1, 16)}.jpg`;
    }

    getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}
