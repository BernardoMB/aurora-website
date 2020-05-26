import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit, AfterViewInit {
  @Input() review;
  @ViewChild('description') el: ElementRef;

  height = '66px';
  fixedHeight = true;
  showReadMoreButton = false;

  constructor() {}

  ngOnInit() {
    // console.log('Initializing review card. ShowReadMoreButton?', this.showReadMoreButton);
  }

  ngAfterViewInit(): void {
    const elementHeight = this.el.nativeElement.offsetHeight;
    // console.log('Element height', elementHeight);
    if (elementHeight > 66) {
      // console.log('Element height is greater than 66px');
      setTimeout(() => {
        this.showReadMoreButton = true;
      }, 1);
    }
    // console.log('Review', this.review);
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
