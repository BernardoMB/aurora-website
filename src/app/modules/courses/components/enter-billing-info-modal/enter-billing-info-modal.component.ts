import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export interface IBillingInfo {
  billingzip: string;
  billingcity: string;
  billingaddress: string;
  billingstate: string;
  billingcountry: string;
}

@Component({
  selector: 'app-enter-billing-info-modal',
  templateUrl: './enter-billing-info-modal.component.html',
  styleUrls: ['./enter-billing-info-modal.component.scss']
})
export class EnterBillingInfoModalComponent implements OnInit {

  billingInfoForm = new FormGroup({
    billingzip: new FormControl('', [Validators.required]),
    billingcity: new FormControl('', [Validators.required]),
    billingaddress: new FormControl('', [Validators.required]),
    billingstate: new FormControl('', [Validators.required]),
    billingcountry: new FormControl('', [Validators.required])
  });
  get isValid(): boolean {
    return this.billingInfoForm.valid && !this.billingInfoForm.pristine;
  }

  constructor(
    public dialogRef: MatDialogRef<EnterBillingInfoModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(this.billingInfoForm.value);
  }

}
