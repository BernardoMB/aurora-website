import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
})
export class LessonCardComponent implements OnInit, AfterViewInit {
  // TODO: Implement lesson type.
  @Input() lesson;
  @Input() lessonNumber;
  @Input() enrolled: boolean;
  @ViewChild('description') el: ElementRef;
  @Output() navigateToLesson: EventEmitter<void> = new EventEmitter();

  height = '66px';
  fixedHeight = true;
  showReadMoreButton = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const elementHeight = this.el.nativeElement.offsetHeight;
    if (elementHeight > 66) {
      // console.log('Element height: ', elementHeight);
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

  goToLesson() {
    this.navigateToLesson.emit(this.lesson.id);
  }
}
