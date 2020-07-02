import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReadTimePipe } from './pipes/read-time.pipe';
import { CreditCardNumberPipe } from './pipes/credit-card-number.pipe';
import { LoadingbarComponent } from './components/loadingbar/loadingbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AnimatedLogoSpinnerComponentComponent } from './components/animated-logo-spinner-component/animated-logo-spinner-component.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    ReadTimePipe,
    CreditCardNumberPipe,
    LoadingbarComponent,
    LoaderComponent,
    AnimatedLogoSpinnerComponentComponent,
  ],
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  exports: [
    FlexLayoutModule,
    ReadTimePipe,
    CreditCardNumberPipe,
    LoadingbarComponent,
    LoaderComponent,
    AnimatedLogoSpinnerComponentComponent,
    MatIconModule,
  ],
  providers: [],
})
export class SharedModule {}
