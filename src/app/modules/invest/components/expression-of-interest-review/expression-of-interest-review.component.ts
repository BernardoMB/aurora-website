import { Component, OnInit, Input } from '@angular/core';
import { ExpressionOfInterest } from '../../models/expression-of-interest.model';

@Component({
  selector: 'app-expression-of-interest-review',
  templateUrl: './expression-of-interest-review.component.html',
  styleUrls: ['./expression-of-interest-review.component.scss'],
})
export class ExpressionOfInterestReviewComponent implements OnInit {
  @Input() expressionOfInterest: ExpressionOfInterest;

  constructor() {}

  ngOnInit() {}
}
