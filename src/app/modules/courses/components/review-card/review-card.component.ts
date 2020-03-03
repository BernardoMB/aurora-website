import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit, AfterViewInit {
  @Input() review;
  @Input() reviewNumber;
  @ViewChild('description', { static: false }) el: ElementRef;

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
    console.log('REVIEW', this.review);
    console.log('REVIEW review', this.review.review);
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
