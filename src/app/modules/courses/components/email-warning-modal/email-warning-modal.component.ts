import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-email-warning-modal',
  templateUrl: './email-warning-modal.component.html',
  styleUrls: ['./email-warning-modal.component.scss']
})
export class EmailWarningModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EmailWarningModalComponent>,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
  }

  onClose() {
    // Close modal
    this.dialogRef.close();
  }

  resendEmail() {
    this.authService.resendEmailVerification().pipe(
      catchError((error) => {
        console.log(error);
        throw error;
        this.toastr.error('Could not send verification email');
      })
      ).subscribe((emailVerificationSend: boolean) => {
        if (emailVerificationSend) {
          this.toastr.success('Verification email sent');
      }
    });
  }
}
