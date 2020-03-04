import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit, AfterViewInit {
  @Input() review;
  @ViewChild('description', { static: false }) el: ElementRef;

  height = '66px';
  fixedHeight = true;
  showReadMoreButton = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const elementHeight = this.el.nativeElement.offsetHeight;
    if (elementHeight > 66) {
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
