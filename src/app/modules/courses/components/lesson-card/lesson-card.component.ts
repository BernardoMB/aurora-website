import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
})
export class LessonCardComponent implements OnInit, AfterViewInit {
  @Input() lesson;
  @Input() lessonNumber;
  @ViewChild('description', { static: false }) el: ElementRef;

  height = '66px';
  fixedHeight = true;
  showReadMoreButton = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const elementHeight = this.el.nativeElement.offsetHeight;
    if (elementHeight > 66) {
      console.log('Element height: ', elementHeight);
      setTimeout(() => {
        this.showReadMoreButton = true;
      }, 1);
    }
  }

  unSetHeight() {
    this.height = 'unset';
    this.fixedHeight = false;
  }

  setHeight() {
    this.height = '66px';
    this.fixedHeight = true;
  }
}
