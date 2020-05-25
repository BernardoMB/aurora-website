import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { State } from '../../store/state';
import { selectAuthUser, selectAuthIsAuthenticated } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-email-verified-action-modal',
  templateUrl: './email-verified-action-modal.component.html',
  styleUrls: ['./email-verified-action-modal.component.scss']
})
export class EmailVerifiedActionModalComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    public dialogRef: MatDialogRef<EmailVerifiedActionModalComponent>,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  onClose() {
    // Close modal
    this.dialogRef.close();
  }

  closeAndShowLogin() {
    this.dialogRef.close({ showLoginModalOnClose: true });
  }

}
