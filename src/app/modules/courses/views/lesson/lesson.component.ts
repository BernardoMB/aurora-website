import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy {
  @ViewChild('player', { static: true }) private playerElement: ElementRef;

  decryptionKeyToken: string;

  lessonSubscription: Subscription;
  lesson: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    // TODO: request decryption key token.
  }

  ngOnInit() {
    this.decryptionKeyToken = '';
    this.route.data.subscribe((data: any) => {
      if (data.lesson) {
        this.lesson = data.lesson;
      }
    });
  }

  ngOnDestroy() {

  }

  async downloadFile() {
    // Best option
    const link = document.createElement('a');
    link.href = this.lesson.documentUrl;
    link.download = this.lesson.title;
    link.click();
    window.URL.revokeObjectURL(this.lesson.documentUrl);
    window.open(this.lesson.documentUrl);
  }
}
