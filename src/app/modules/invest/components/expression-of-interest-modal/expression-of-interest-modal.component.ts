import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-expression-of-interest-modal',
  templateUrl: './expression-of-interest-modal.component.html',
  styleUrls: ['./expression-of-interest-modal.component.scss'],
})
export class ExpressionOfInterestModalComponent implements OnInit {
  amountsToInvest = [
    '1 - 5,000',
    '5,001 - 50,000',
    '50,001 - 100,000',
    '100,001 - 200,000',
    '200,001 - 500,000',
    '500,001 - 1,000,000',
    '1,000,001 - 5,000,000',
    '5,000,001 - 10,000,000',
    '10,000,001 - above',
  ];

  expressionOfInterestForm = new FormGroup({
    availableIPOs: new FormControl('West National Inc.', [Validators.required]),
    surname: new FormControl('Oni', [Validators.required]),
    firstName: new FormControl('Igbo', [Validators.required]),
    middleName: new FormControl('Adewale', []),
    address: new FormControl('Lagos Avenue #1, Lagos, Nigeria', [
      Validators.required,
    ]),
    phoneNumber: new FormControl('234094614000', [Validators.required]),
    email: new FormControl('admin@fint.com', [
      Validators.required,
      Validators.email,
    ]),
    bankName: new FormControl('SunTrust Bank Nigeria', [Validators.required]),
    bankAccountNumber: new FormControl('27147369', [Validators.required]),
    availableInvestment: new FormControl(this.amountsToInvest[6], [
      Validators.required,
    ]),
  });

  confirmFormControl = new FormControl(false, [Validators.requiredTrue]);

  stage = 0;

  constructor(
    public dialogRef: MatDialogRef<ExpressionOfInterestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {}

  onSubmit() {
    console.log('On submit');
    this.dialogRef.close({
      ...this.expressionOfInterestForm.value,
      performedDate: new Date(),
    });
  }
}
