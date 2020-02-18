import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-ipo-modal',
  templateUrl: './ipo-modal.component.html',
  styleUrls: ['./ipo-modal.component.scss'],
})
export class IpoModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IpoModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { transaction: Transaction; index: number },
  ) {}

  sharesAvailable = 30000;
  costPerShare = 123;
  ipoBuyForm = new FormGroup({
    desiredShares: new FormControl(0, [
      Validators.min(1),
      Validators.max(this.sharesAvailable),
    ]),
    prospectusChecked: new FormControl(false, [Validators.requiredTrue]),
  });
  get amountToPay() {
    return this.ipoBuyForm.get('desiredShares').value * this.costPerShare;
  }

  ngOnInit() {}

  onSubmit() {
    console.log('On submit', this.ipoBuyForm.value);
    this.dialogRef.close({
      desiredShares: this.ipoBuyForm.get('desiredShares').value,
      amountToPay: this.amountToPay,
      performedDate: new Date(),
      index: this.data.index,
      transaction: this.data.transaction,
    });
  }
}
