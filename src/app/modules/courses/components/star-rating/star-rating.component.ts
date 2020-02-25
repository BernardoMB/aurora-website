import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-mat-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StarRatingComponent implements OnInit, AfterViewInit {
  @Input() rating: number;
  @Input() starCount: number;
  @Input() color: string;
  @Output() ratingUpdated = new EventEmitter();

  snackBarDuration = 2000;
  ratingArr = [];

  constructor(
    private focusMonitor: FocusMonitor // For disabling wierd classes when a star is focused
  ) {
  }

  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  ngAfterViewInit() {
    // For disabling wierd classes when a star is focused
    for (let index = 0; index < this.starCount; index++) {
      this.focusMonitor.stopMonitoring(document.getElementById('star_' + index));
    }
  }

  onClick(rating: number) {
    // console.log(rating);
    /* this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration
    }); */
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn'
}
