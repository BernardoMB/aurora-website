import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReadTimePipe } from './pipes/read-time.pipe';
@NgModule({
  declarations: [ReadTimePipe],
  imports: [CommonModule, FlexLayoutModule],
  exports: [FlexLayoutModule, ReadTimePipe],
  providers: []
})
export class SharedModule {}
