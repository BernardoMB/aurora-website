import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-enter-pin-modal',
  templateUrl: './enter-pin-modal.component.html',
  styleUrls: ['./enter-pin-modal.component.scss']
})
export class EnterPinModalComponent implements OnInit {

  pinControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

  constructor(
    public dialogRef: MatDialogRef<EnterPinModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(this.pinControl.value);
  }

}
