import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-email-modal',
  templateUrl: './verify-email-modal.component.html',
  styleUrls: ['./verify-email-modal.component.scss']
})
export class VerifyEmailModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VerifyEmailModalComponent>
  ) {}

  ngOnInit() {
  }

  onClose() {
    // Close modal
    this.dialogRef.close();
  }

  closeAndShowLogin() {
    this.dialogRef.close({ showLoginModalOnClose: true });
  }
}
