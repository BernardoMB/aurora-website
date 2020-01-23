import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-amp-player',
  templateUrl: './amp-player.component.html',
  styleUrls: ['./amp-player.component.scss'],
})
export class AmpPlayerComponent implements OnInit {
  @ViewChild('video', { static: true }) videoPlayer;
  @Input() id: string;
  @Input() src: string;
  @Input() token: string;
  @Input() autoplay: boolean;
  @Input() width: string;
  @Input() height: string;
  version = '2.2';

  constructor() {}

  ngOnInit() {
    // Dynamically load the amp player control
    const myPlayer = amp(this.videoPlayer.nativeElement, {
      /* Options */
      autoplay: this.autoplay,
      controls: true,
      // @ts-ignore
      width: this.width,
      height: this.height,
      id: this.id,
      logo: { enabled: false },
      ampAds: {
        mainProgram: {
          source: [
            {
              src: this.src,
              protectionInfo: [
                {
                  type: amp.protectionType.AES,
                  authenticationToken: `Bearer=${this.token}`,
                },
              ],
            },
          ],
        },
      },
    });

    myPlayer.ngComponent = this;
  }
}
