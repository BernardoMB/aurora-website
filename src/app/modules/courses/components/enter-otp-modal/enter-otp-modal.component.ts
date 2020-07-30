import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enter-otp-modal',
  templateUrl: './enter-otp-modal.component.html',
  styleUrls: ['./enter-otp-modal.component.scss']
})
export class EnterOtpModalComponent implements OnInit {

  otpControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);

  constructor(
    public dialogRef: MatDialogRef<EnterOtpModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.otpControl.valid) {
      this.dialogRef.close(this.otpControl.value);
    } else {
      this.otpControl.setErrors({ invalidOtp: 'Invalid OTP. Please enter a valid OTP number'});
    }
  }

}
