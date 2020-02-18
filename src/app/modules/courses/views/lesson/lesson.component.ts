import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  lesson = {
    thumbnailsUrls: [
      'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000001.png',
      'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000002.png',
      'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000003.png',
    ],
    title: 'Measuring risk',
    // tslint:disable-next-line: max-line-length
    description:
      // tslint:disable-next-line: max-line-length
      'We will develop the concept of risk using the notion of probability and financial consequences. Instruments for measuring risk and uncertainty and using them for decision making processes will be discussed. We will use statistical concepts, notion of frequency and severity of risk and above all, we will use the Law of Large Numbers.',
    type: 'VIDEO',
    course: '5deffd13ef2fd3002404263e',
    order: 2,
    createdAt: '2019-12-10T22:58:44.826Z',
    updatedAt: '2019-12-16T09:54:46.604Z',
    fileDuration: 117.59,
    fileSize: 4436527,
    fileName: '8a45abf671e0f1389f05b05a310d848f7.mp4',
    assetName: '8a45abf671e0f1389f05b05a310d848f7',
    // tslint:disable-next-line: max-line-length
    adaptiveStreamingUrl:
      // tslint:disable-next-line: max-line-length
      // 'https://courses-euwe.streaming.media.azure.net/9c7769ff-605a-422c-95b6-54ac0124e72f/8a45abf671e0f1389f05b05a310d848f.ism/manifest(encryption=cbc)',
      'https://courses-euwe.streaming.media.azure.net/0612b23e-bba2-4ac7-9f9f-00aaea47d9f7/unicorn.ism/manifest',
    readTime: null,
    id: '5df023246c985f0024febd91',
  };

  decryptionKeyToken: string;

  constructor() {}

  ngOnInit() {
    this.decryptionKeyToken = '';
  }
}
