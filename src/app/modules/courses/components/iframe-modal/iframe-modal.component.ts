import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-modal',
  templateUrl: './iframe-modal.component.html',
  styleUrls: ['./iframe-modal.component.scss']
})
export class IframeModalComponent implements OnInit {
  authurl: any;

  constructor(
    public dialogRef: MatDialogRef<IframeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private sanitizer: DomSanitizer
  ) {
      console.log('Dialog data', data);
      if (data) {
        this.authurl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
      }
    }

  ngOnInit(): void {
  }

}
