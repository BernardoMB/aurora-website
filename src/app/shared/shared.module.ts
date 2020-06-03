import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReadTimePipe } from './pipes/read-time.pipe';
import { CreditCardNumberPipe } from './pipes/credit-card-number.pipe';
@NgModule({
  declarations: [ReadTimePipe, CreditCardNumberPipe],
  imports: [CommonModule, FlexLayoutModule],
  exports: [FlexLayoutModule, ReadTimePipe, CreditCardNumberPipe],
  providers: []
})
export class SharedModule {}
