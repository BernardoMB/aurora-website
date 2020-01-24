import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  articles = [
    [
      {
        comments: [
          {
            user: '5deabdd1671319082c534e2f',
            article: '5df018703a76e82bb008d87b',
            text: 'Esta muy chido',
            createdAt: '2019-12-10T22:18:54.063Z',
            updatedAt: '2019-12-10T22:18:54.063Z',
            id: '5df019cea955730b8cd764df',
          },
          {
            user: '5deabdd1671319082c534e2f',
            article: '5df018703a76e82bb008d87b',
            text: 'Esta muy chido',
            createdAt: '2019-12-10T22:19:40.173Z',
            updatedAt: '2019-12-10T22:19:40.173Z',
            id: '5df019fca99f9a2ab859f634',
          },
          {
            user: '5deabdd1671319082c534e2f',
            article: '5df018703a76e82bb008d87b',
            text: 'Esta muy chido',
            createdAt: '2019-12-10T22:19:44.464Z',
            updatedAt: '2019-12-10T22:19:44.464Z',
            id: '5df01a00a99f9a2ab859f635',
          },
          {
            user: '5deabdd1671319082c534e2f',
            article: '5df018703a76e82bb008d87b',
            text: 'Esta muy chido',
            createdAt: '2019-12-10T22:19:45.145Z',
            updatedAt: '2019-12-10T22:19:45.145Z',
            id: '5df01a01a99f9a2ab859f636',
          },
          {
            user: '5deabdd1671319082c534e2f',
            article: '5df018703a76e82bb008d87b',
            text: 'Esta muy chido',
            createdAt: '2019-12-10T22:19:45.860Z',
            updatedAt: '2019-12-10T22:19:45.860Z',
            id: '5df01a01a99f9a2ab859f637',
          },
        ],
        likes: ['5df79d445d58f147c4c38d12'],
        dislikes: [],
        title: 'Some title',
        subtitle: 'Some subtitle',
        description: 'Some description',
        type: 'InternalArticle',
        data: '## Some markdown \n data\\n - Some item\\n - Some other item\\n',
        readTime: '10 min',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/articleimages/9d0738d2ac7b89b762910633c0010d10495.png',
        createdAt: '2019-12-10T22:13:04.624Z',
        updatedAt: '2019-12-16T15:05:40.636Z',
        totalLikes: 1,
        id: '5df018703a76e82bb008d87b',
      },
      {
        comments: [],
        likes: [],
        dislikes: ['5df79dd15d58f147c4c38d16'],
        title: 'Some title',
        subtitle: 'Some subtitle',
        description: 'Some description',
        type: 'InternalArticle',
        data: '## Some markdown \n data\\n - Some item\\n - Some other item\\n',
        readTime: '10 min',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/articleimages/4af71a6b6ee8e95254dc5dc2496a908f.png',
        createdAt: '2019-12-16T15:07:37.569Z',
        updatedAt: '2019-12-16T15:08:01.093Z',
        totalLikes: 0,
        id: '5df79db95d58f147c4c38d14',
      },
      {
        comments: [],
        likes: [],
        dislikes: [],
        title: 'Some title',
        subtitle: 'Some subtitle',
        description: 'Some description',
        type: 'InternalArticle',
        data: '## Some markdown \n data\\n - Some item\\n - Some other item\\n',
        readTime: '10 min',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/articleimages/91710be36cb7310d237e186694b9c8e147.png',
        createdAt: '2019-12-16T21:21:24.772Z',
        updatedAt: '2019-12-16T21:21:24.772Z',
        id: '5df7f5543ced0105407a5f8d',
      },
      {
        comments: [],
        likes: [],
        dislikes: [],
        title: 'Some title',
        subtitle: 'Some subtitle',
        description: 'Some description',
        type: 'InternalArticle',
        data: '## Some markdown \n data\\n - Some item\\n - Some other item\\n',
        readTime: '10 min',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/articleimages/4b12e607a1c8d88e784eabf2fa8a7892.png',
        createdAt: '2019-12-16T21:22:03.671Z',
        updatedAt: '2019-12-16T21:22:03.671Z',
        id: '5df7f57bdf4bc208c880a0fa',
      },
      {
        comments: [],
        likes: [],
        dislikes: [],
        title: 'Some title',
        subtitle: 'Some subtitle',
        description: 'Some description',
        type: 'InternalArticle',
        data: '## Some markdown \n data\\n - Some item\\n - Some other item\\n',
        readTime: '10 min',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/articleimages/4814d9ab010d7c56109ba16a4bb7663c9b.png',
        createdAt: '2019-12-16T21:23:05.398Z',
        updatedAt: '2019-12-16T21:23:05.398Z',
        id: '5df7f5b93a0eab396c456dd3',
      },
    ],
  ];

  constructor() {}

  ngOnInit() {}
}
