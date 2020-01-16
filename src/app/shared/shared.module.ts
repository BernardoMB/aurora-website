import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadTimePipe } from './pipes/read-time.pipe';



@NgModule({
  declarations: [ReadTimePipe],
  imports: [
    CommonModule
  ], exports: [ReadTimePipe]
})
export class SharedModule { }
