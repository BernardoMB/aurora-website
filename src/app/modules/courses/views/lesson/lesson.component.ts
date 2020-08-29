import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy/* , AfterViewInit */ {
  decryptionKeyToken: string;
  lesson: any;
  playerOptions;
  showLessonVideo = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    // TODO: request decryption key token.
    this.route.data.subscribe((data: any) => {
      if (data.lesson) {
        console.log('Got lesson', data.lesson);
        this.lesson = data.lesson;
        if (this.lesson.type !== 'VIDEO') {
          this.showLessonVideo = false;
        }
      }
    });
  }

  ngOnInit() {
    this.decryptionKeyToken = '';
    this.route.data.subscribe((data: any) => {
      if (data.lesson) {
        console.log('Got lesson', data.lesson);
        this.lesson = data.lesson;
        if (this.lesson.type === 'VIDEO') {
          this.playerOptions = {
            autoplay: false,
            controls: true,
            width: 'auto',
            height: '100%',
            id: 'azuremediaplayer',
            logo: { enabled: false },
            ampAds: {
              mainProgram: {
                source: [
                  {
                    src: this.lesson.adaptiveStreamingUrl,
                    protectionInfo: [
                      {
                        type: amp.protectionType.AES,
                        authenticationToken: `Bearer=${this.decryptionKeyToken}`,
                      },
                    ],
                  },
                ],
              },
            },
            playbackSpeed: {
              enabled: true,
              initialSpeed: 1.0,
              speedLevels: [
                { name: 'x4.0', value: 4.0 },
                { name: 'x3.0', value: 3.0 },
                { name: 'x2.0', value: 2.0 },
                { name: 'x1.75', value: 1.75 },
                { name: 'x1.5', value: 1.5 },
                { name: 'x1.25', value: 1.25 },
                { name: 'normal', value: 1.0 },
                { name: 'x0.75', value: 0.75 },
                { name: 'x0.5', value: 0.5 },
              ],
            },
          };
          setTimeout(() => {
            const myPlayer = amp('azuremediaplayer', this.playerOptions);
            console.log('setting source');
            myPlayer.src([{
              src: this.lesson.adaptiveStreamingUrl,
              type: 'application/vnd.ms-sstr+xml',
              protectionInfo: [{
                type: amp.protectionType.AES,
                authenticationToken: 'Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=5f5076de-4322-42f7-a533-6265f686d5b9&Audience=urn%3atest&ExpiresOn=4581880130&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=%2bx77Qo0CeBzP4aCntfe2sVkbKeKguOUNAebHQb53sLc%3d'
              }]
            }]);
          }, 0);
        }
      }
    });
  }

  updatePayer() {}

  ngOnDestroy() {}

  async downloadFile() {
    // Best option
    const link = document.createElement('a');
    link.href = this.lesson.documentUrl;
    link.download = this.lesson.title;
    link.click();
    window.URL.revokeObjectURL(this.lesson.documentUrl);
    window.open(this.lesson.documentUrl);

    // Alternative CORS Issues
    /* this.http.get(this.lesson.documentUrl, {responseType: 'blob', headers: {'Access-Control-Allow-Origin': '*'}}).subscribe(response => {
      const blob: any = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      // window.location.href = response.url;
      const fileName = this.lesson.documentUrl.split('lessondocuments/')[1];
      fileSaver.saveAs(blob, fileName);
    }); */
  }

}
