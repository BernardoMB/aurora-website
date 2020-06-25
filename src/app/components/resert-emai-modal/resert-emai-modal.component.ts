import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resert-emai-modal',
  templateUrl: './resert-emai-modal.component.html',
  styleUrls: ['./resert-emai-modal.component.scss']
})
export class ResertEmaiModalComponent implements OnInit {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  errorMessage;

  constructor(
    public dialogRef: MatDialogRef<ResertEmaiModalComponent>,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.emailControl.valueChanges.subscribe(() => {
      this.errorMessage = undefined;
    });
  }

  onSubmit(): void {
    if (this.emailControl.valid) {
      this.authService.requestPasswordResetEmail(this.emailControl.value.toLowerCase()).pipe(
        catchError((error) => {
          console.log('No mames ocurrio un error', error);
          if (error.error.errorCode === 10) {
            this.toastrService.error('Could not send reset password email');
            this.errorMessage = 'Email has not been registered';
          }
          throw error;
        })
      ).subscribe(() => {
        this.toastrService.success('Reset password email sent');
        this.dialogRef.close();
        console.log('ResetEmailModalComponent: Email succesfully sent. Redirecting user');
        this.router.navigate(['user/forgot-password']);
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
