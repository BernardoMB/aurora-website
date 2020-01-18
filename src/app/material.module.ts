import { NgModule } from '@angular/core';
import {
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
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
  ],
  exports: [
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class MaterialModule {}
