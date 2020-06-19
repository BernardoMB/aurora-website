import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReadTimePipe } from './pipes/read-time.pipe';
import { CreditCardNumberPipe } from './pipes/credit-card-number.pipe';
import { LoadingbarComponent } from './components/loadingbar/loadingbar.component';
@NgModule({
  declarations: [ReadTimePipe, CreditCardNumberPipe, LoadingbarComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [FlexLayoutModule, ReadTimePipe, CreditCardNumberPipe, LoadingbarComponent],
  providers: []
})
export class SharedModule {}
