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
    });

    myPlayer.ngComponent = this;
  }
}
