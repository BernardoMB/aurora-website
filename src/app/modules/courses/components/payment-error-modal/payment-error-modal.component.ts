import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-error-modal',
  templateUrl: './payment-error-modal.component.html',
  styleUrls: ['./payment-error-modal.component.scss']
})
export class PaymentErrorModalComponent implements OnInit {
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<PaymentErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { errorMessage: string }
  ) {
    if (data && data.errorMessage) {
      this.errorMessage = data.errorMessage;
    }
  }

  ngOnInit(): void {
  }

  onClose() {
    // Close modal
    this.dialogRef.close();
  }

}
