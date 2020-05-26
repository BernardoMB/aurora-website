import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnInit {
  errorMessage: string | null;
  review = new FormControl('');
  reviewForm = new FormGroup({
    review: this.review
  });
  rating = 0;

  /* get isValid(): boolean {
    if (this.rating === 0) {
      return true;
    }
    return false;
  } */

  constructor(public dialogRef: MatDialogRef<ReviewModalComponent>) { }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.rating === 0) {
      this.errorMessage = 'Please rate this course';
      return;
    }
    this.dialogRef.close({
      rating: this.rating,
      review: this.reviewForm.controls.review.value
    });
  }

  onClose() {
    this.reviewForm.reset();
    // Close modal
    this.dialogRef.close();
  }

  onRatingUpdated(rating: number) {
    this.errorMessage = undefined;
    this.rating = rating;
  }

}
