import { NgModule } from '@angular/core';
import {
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatRadioModule
} from '@angular/material';

@NgModule({
  // Add material components the application uses
  imports: [
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  exports: [
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule
  ],
})
export class MaterialModule {}
