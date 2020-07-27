import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { EventCardComponent } from './../app/modules/events/components/event-card/event-card.component';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { SharedModule } from '../app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from '../app/material.module';
import { EventsRoutingModule } from '../app/modules/events/events-routing.module';
import { SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SubscriptionsComponent } from '../app/modules/events/views/subscriptions/subscriptions.component';
import { EventDetailComponent } from '../app/modules/events/views/event-detail/event-detail.component';
import { AllEventsComponent } from '../app/modules/events/views/all-events/all-events.component';
import { EventsComponent } from '../app/modules/events/events/events.component';
import { EventSwiperCardComponent } from '../app/modules/events/components/event-swiper-card/event-swiper-card.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from '../app/app-routing.module';
import { AppComponent } from '../app/app.component';
import { HeaderComponent } from '../app/components/header/header.component';
import { LandingComponent } from '../app/components/landing/landing.component';
import { FooterComponent } from '../app/components/footer/footer.component';
import { NotFoundComponent } from '../app/components/not-found/not-found.component';
import { LoginFormComponent } from '../app/components/login-form/login-form.component';
import { SignupFormComponent } from '../app/components/signup-form/signup-form.component';
import { VerifyEmailModalComponent } from '../app/components/verify-email-modal/verify-email-modal.component';
import { EmailVerifiedActionModalComponent } from '../app/components/email-verified-action-modal/email-verified-action-modal.component';
import { ResertEmaiModalComponent } from '../app/components/resert-emai-modal/resert-emai-modal.component';
import { ForgotEmailSentComponent } from '../app/components/forgot-email-sent/forgot-email-sent.component';
import { ResetPasswordComponent } from '../app/components/reset-password/reset-password.component';
import { MainComponent } from '../app/components/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { plainToClass, deserializeArray } from 'class-transformer';
import { Set } from 'immutable';
import { cloneDeep } from 'lodash';
import { Event } from '../app/modules/events/models/event.model';

export default {
  title: 'Events Card Stories',
  component: EventCardComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [
        EventsComponent,
        AllEventsComponent,
        EventDetailComponent,
        SubscriptionsComponent,
        EventCardComponent,
        EventSwiperCardComponent,
        AppComponent,
        HeaderComponent,
        LandingComponent,
        FooterComponent,
        NotFoundComponent,
        LoginFormComponent,
        SignupFormComponent,
        VerifyEmailModalComponent,
        EmailVerifiedActionModalComponent,
        ResertEmaiModalComponent,
        ForgotEmailSentComponent,
        ResetPasswordComponent,
        MainComponent,
      ],
      imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes),
        EventsRoutingModule,
        BrowserModule,
        SharedModule,
        MaterialModule,
        ScrollingModule,
        NgxPaginationModule,
        MatProgressSpinnerModule,
        MatIconModule,
        SwiperModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      //   providers: [
      //     {
      //       provide: SWIPER_CONFIG,
      //       useValue: DEFAULT_SWIPER_CONFIG,
      //     },
      //   ],
    }),
  ],
};

const singleEventData = cloneDeep(
  plainToClass(Event, {
    'id': '5efb83a82f06d4948e409478',
    'name': 'Investing Meeting',
    'description':
      'In laboris esse culpa adipisicing in occaecat. Elit qui quis Lorem sint qui id eu proident. Commodo consequat cupidatat voluptate quis officia esse est exercitation ad eiusmod labore officia. Irure ad ullamco aliquip ut eiusmod voluptate pariatur amet exercitation eiusmod dolore consequat et irure.\r\nEt ad elit anim aliqua mollit incididunt labore laborum elit. Mollit duis minim labore elit Lorem cillum eu dolore. Nulla nisi ullamco enim aliquip aliquip dolore esse veniam.\r\n',
    'imgUrl': 'https://picsum.photos/200/200',
    'startDate': '2020-07-15T02:08:29',
    'endDate': '2020-08-27T09:45:24',
    'address': '660 Raleigh Place, Ikorodu,  Lagos, 9585',
    'organizer': 'Spacewax',
    'location': {
      'type': 'point',
      'coordinates': [8.545903, 5.753685],
    },
    'subscribed': Set([
      '5efb83a84789556f1fbf43da',
      '5efb83a8d2bc71152d6d4d16',
      '5efb83a87c7b245170da8402',
      '5efb83a8b20970a5f191be43',
      '5efb83a826be7d3d657a6020',
    ]),
    'createdAt': '2020-07-11T10:50:16',
    'updatedAt': '2020-07-12T08:40:05',
  }),
) as Event;

const multipleEventsData = plainToClass(Event, [
  {
    'id': '5efb83a8fd131ed177fa2af0',
    'name': 'Incredible Seminar',
    'description':
      'Lorem enim consectetur ea non ipsum reprehenderit elit voluptate. Duis sunt consequat enim dolor adipisicing reprehenderit consequat do irure reprehenderit do eiusmod do. Id laborum duis sit commodo fugiat reprehenderit commodo ad. Consequat magna laborum nulla qui sunt adipisicing eiusmod. Esse qui non est nisi eiusmod dolor culpa ipsum occaecat elit consequat consectetur non pariatur.\r\nLaborum in velit ut ad eu amet dolor enim. Quis aliqua est sit ea nostrud nulla do anim do occaecat. Laborum ipsum anim id Lorem. Laboris sit voluptate proident nisi in. Minim ex quis veniam nisi elit ea labore reprehenderit dolor excepteur ullamco irure ea.\r\n',
    'imgUrl':
      'https://z9hbb3mwou383x1930ve0ugl-wpengine.netdna-ssl.com/wp-content/uploads/65920_302d36bd85002e3.jpg',
    'startDate': '2020-07-13T03:12:12',
    'endDate': '2020-09-05T06:23:16',
    'address': '527 Turner Place, Jos,  Lagos, 7322',
    'organizer': 'Chillium',
    'location': {
      'type': 'point',
      'coordinates': [12.282369, 8.815762],
    },
    'subscribed': Set([
      '5efb83a8e5e90c7ff58e3b90',
      '5efb83a88d8fb23153c65e9c',
      '5efb83a80a7798822842ce2b',
      '5efb83a8bd475a9ad12b8543',
      '5efb83a83fab360b86379bf5',
    ]),
    'createdAt': '2020-07-05T08:16:06',
    'updatedAt': '2020-06-30T10:17:38',
  },
  {
    'id': '5efb83a8cd157f13ee76ce75',
    'name': 'Finantial Course',
    'description':
      'Pariatur occaecat officia minim ullamco ut irure laborum et in. Velit aliqua ullamco dolore non commodo officia adipisicing tempor. Duis cillum nisi proident incididunt velit tempor fugiat eu. Qui commodo id esse duis. Culpa reprehenderit magna duis ea magna ipsum amet commodo consequat deserunt est. Sint enim adipisicing Lorem veniam ex aliqua qui minim ullamco exercitation elit est exercitation. Tempor non adipisicing voluptate aliqua minim labore.\r\nCommodo aliquip esse ea Lorem cupidatat dolor esse esse. Occaecat aliqua magna duis qui dolor ut ullamco qui quis est voluptate est. Mollit duis id nostrud tempor est reprehenderit consequat excepteur do non. Sunt amet eiusmod consequat proident ut do laborum eu officia. Magna ut et duis dolore esse cupidatat. Laborum anim voluptate amet fugiat culpa proident consequat. Esse officia dolor deserunt aliqua dolore fugiat magna irure qui anim.\r\n',
    'imgUrl': 'https://www.westbaytech.ky/blog/images/techevent.jpg',
    'startDate': '2020-08-02T06:38:33',
    'endDate': '2020-09-08T05:09:18',
    'address': '964 Senator Street, Ikorodu,  Kano State, 9523',
    'organizer': 'Ecstasia',
    'location': {
      'type': 'point',
      'coordinates': [12.707471, 12.120731],
    },
    'subscribed': Set([
      '5efb83a8d6248f835cdef106',
      '5efb83a8fc1b2d4afd5a1b39',

      '5efb83a86f7bc9ffa341de1d',
      '5efb83a87f1a7ae4a79e1e80',
    ]),
    'createdAt': '2020-07-09T11:06:21',
    'updatedAt': '2020-07-01T07:19:38',
  },
  {
    'id': '5efb83a8273a4fcf980cc159',
    'name': 'Finantial Referendum',
    'description':
      'Magna culpa eiusmod elit in cupidatat. Voluptate amet elit proident officia exercitation elit reprehenderit quis dolor qui aliqua. Officia commodo amet voluptate aute.\r\nDeserunt aute pariatur Lorem ad magna do cillum do. Laborum fugiat enim irure cupidatat ex ad eu cupidatat. Pariatur cillum exercitation laborum occaecat duis laboris.\r\n',
    'imgUrl':
      'https://ultraeurope.com/wp-content/uploads/2019/07/europe-og-2020.jpg',
    'startDate': '2020-07-06T09:00:47',
    'endDate': '2020-09-11T04:13:30',
    'address': '131 Harkness Avenue, Lagos,  Delta, 9278',
    'organizer': 'Uneeq',
    'location': {
      'type': 'point',
      'coordinates': [10.221221, 6.806364],
    },
    'subscribed': Set([
      '5efb83a89ce686a5f8e05527',
      '5efb83a85e4441f52f546375',
      '5efb83a8227521ce42ca477a',
      '5efb83a83d81ed95652f58b1',
      '5efb83a88c6d2d99c621ebff',

      '5efb83a82e08583bea77b63d',
      '5efb83a85b4399ee59c7e737',
      '5efb83a870a96ec69e9df740',
      '5efb83a892abf726f8660480',
      '5efb83a82f73617e83f66be1',
      '5efb83a8e661ff7527558eb6',
      '5efb83a846239d938eca55af',
      '5efb83a8e0480630cab0dd66',
      '5efb83a808641102a3551949',
      '5efb83a852f3e432bf73217e',
      '5efb83a8edee230e03876114',
      '5efb83a854b5648671910739',
      '5efb83a8a63918f14337d2aa',
      '5efb83a882c011dd1dbb2e44',
      '5efb83a8822eee1bbb8d67ca',
      '5efb83a88285bad24cd0a689',
      '5efb83a8604bfe3158572099',
      '5efb83a8a0d894323d753f99',
      '5efb83a85165dda23b23de82',
      '5efb83a84b4f3e872bda36eb',
    ]),
    'createdAt': '2020-07-09T03:53:47',
    'updatedAt': '2020-06-30T05:12:27',
  },
  {
    'id': '5efb83a8af6a48f19a482f63',
    'name': 'Finantial Workshop',
    'description':
      'Qui anim est laborum dolor anim minim est elit cupidatat et laborum aute nostrud ullamco. Laborum quis quis Lorem adipisicing ex nisi laborum exercitation adipisicing velit dolore eu. In magna ut ut tempor ex pariatur occaecat labore nisi veniam cillum anim incididunt. Non laboris enim est laborum minim enim mollit commodo occaecat occaecat dolore. Amet pariatur occaecat dolore adipisicing elit irure laborum. Reprehenderit excepteur sunt reprehenderit sit consequat nisi ut est occaecat deserunt esse. Occaecat eiusmod amet veniam qui nulla.\r\nMinim pariatur esse sunt aliquip ipsum proident in reprehenderit. Laboris et ullamco quis aute cupidatat ullamco mollit ipsum. Aliquip aliquip aute nulla deserunt. Reprehenderit in ea officia do voluptate aliquip id. Amet aliqua eiusmod sunt reprehenderit duis et nostrud elit consequat occaecat dolore.\r\n',
    'imgUrl': 'https://picsum.photos/600/900',
    'startDate': '2020-07-24T08:14:03',
    'endDate': '2020-08-30T05:11:59',
    'address': '538 Applegate Court, Ilorin,  Ika South, 4513',
    'organizer': 'Iplax',
    'location': {
      'type': 'point',
      'coordinates': [9.765702, 11.024347],
    },
    'subscribed': Set([
      '5efb83a8149fc03752eeed9c',
      '5efb83a881b7f3f988d0fdbc',
      '5efb83a8dbd870cd6d537d1a',
    ]),
    'createdAt': '2020-07-15T02:49:07',
    'updatedAt': '2020-07-17T12:36:06',
  },
  {
    'id': '5efb83a8172c2e93ba53d28e',
    'name': 'Invest Naija Event',
    'description':
      'Velit id nostrud excepteur et mollit do esse qui nisi aliqua qui commodo. Amet eu laboris reprehenderit duis proident non proident nostrud. Id laboris fugiat et aliquip nostrud sunt est adipisicing dolore veniam cillum id. Veniam esse anim sit mollit laboris sint et sit esse duis ad reprehenderit pariatur in.\r\nQui in esse in laboris ex laborum cupidatat tempor eu. Amet mollit nulla exercitation veniam incididunt in nisi irure aliqua excepteur deserunt fugiat laborum. Do exercitation fugiat ullamco mollit mollit ullamco aliqua eiusmod in nostrud ipsum minim nostrud.\r\n',
    'imgUrl': 'https://picsum.photos/200/200',
    'startDate': '2020-08-11T01:30:48',
    'endDate': '2020-08-27T08:53:41',
    'address': '236 Bragg Court, Nnewi,  Middle Belt, 292',
    'organizer': 'Bizmatic',
    'location': {
      'type': 'point',
      'coordinates': [9.2826, 4.904443],
    },
    'subscribed': Set([
      '5efb83a8288d911248e6e925',
      '5efb83a8cd09c3554b43b5c2',
      '5efb83a8ccd92cf4d1ee2abe',
      '5efb83a87df1f91ba1661db4',
      '5efb83a8519ac2d27519894b',
      '5efb83a8dbdbd7057f21effc',
      '5efb83a80dbf32480cd4cdac',
      '5efb83a8fc198de54288bac4',
      '5efb83a8518e87dfedd191af',
      '5efb83a844cd643882d64a41',
      '5efb83a8b108d6ee139f31fb',
      '5efb83a883e55e2e0c9742f4',
      '5efb83a8a4797a3ac1af3f7f',
      '5efb83a82ba1751401bea87f',
      '5efb83a87728a50d724971ae',
      '5efb83a847a4759a212ef36a',
      '5efb83a8fbf64191419c8b2d',
      '5efb83a87c585b3d071173b9',
      '5efb83a83fdb7282b76ee2af',
      '5efb83a8dcc10ee92bda65d0',
    ]),
    'createdAt': '2020-07-07T11:46:58',
    'updatedAt': '2020-07-14T05:56:04',
  },
  {
    'id': '5efb83a8d82e6a82fbfc6cb4',
    'name': 'Educational Fair',
    'description':
      'Mollit ex occaecat velit deserunt nisi irure nulla. Dolore do consectetur do tempor adipisicing eiusmod minim adipisicing cupidatat ad qui qui Lorem. Sit nostrud deserunt nostrud incididunt nulla. Deserunt veniam aute amet voluptate quis sint incididunt anim aute et. Sit consectetur occaecat aute amet labore. Eiusmod velit esse enim excepteur Lorem excepteur. Qui ullamco occaecat cillum ex eiusmod sint nisi laborum minim qui.\r\nElit aute irure quis amet quis incididunt laborum excepteur commodo. Cillum mollit amet deserunt nulla tempor sint Lorem cupidatat laboris sit aliqua. Ex do mollit consequat tempor sunt officia magna incididunt consequat aliquip pariatur et esse anim. Ea voluptate labore minim pariatur labore pariatur do laborum ad sunt. Excepteur ullamco ea culpa cillum elit dolore eiusmod esse.\r\n',
    'imgUrl':
      'https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg',
    'startDate': '2020-07-25T12:33:16',
    'endDate': '2020-09-14T08:17:39',
    'address': '345 Green Street, Abuja,  Middle Belt, 3776',
    'organizer': 'Intrawear',
    'location': {
      'type': 'point',
      'coordinates': [11.227077, 8.514384],
    },
    'subscribed': Set([
      '5efb83a8970639bd6711efdd',
      '5efb83a80f0e4cb6e92e8f7e',
      '5efb83a8bf542c7720d54038',
      '5efb83a85c2e929523023a8a',
      '5efb83a87a8c48ba21a825d1',
      '5efb83a8354ed2bf2b9df540',
      '5efb83a84b7e278e069c47bf',
      '5efb83a8d5bedfd20c597c47',
      '5efb83a8b763fda0f679df99',
      '5efb83a8d47065ea5c344549',
      '5efb83a81f551603a3fbf992',
      '5efb83a821a2120e771f9f80',
      '5efb83a801b54d7ffe8c9849',
      '5efb83a85e06187044904863',
      '5efb83a82dbe76cb254f1539',
      '5efb83a8fc1af9517c583eba',
      '5efb83a846574e705ac1bdec',
      '5efb83a8520d12fdfc4ec743',
      '5efb83a86a2c7283c89e696d',
    ]),
    'createdAt': '2020-07-14T05:41:28',
    'updatedAt': '2020-07-14T06:45:52',
  },
  {
    'id': '5efb83a827a2e005d4b285ab',
    'name': 'Innovation Fair',
    'description':
      'Enim excepteur consectetur nostrud laborum aliquip dolore cillum do veniam. Pariatur officia commodo est officia laborum ex in officia anim. Ea magna ullamco voluptate aliqua mollit officia Lorem deserunt non id nisi excepteur. Nostrud culpa quis proident in ipsum commodo quis adipisicing do.\r\nMollit dolore laboris duis labore proident adipisicing mollit aute esse veniam excepteur amet qui. Aliquip ea mollit adipisicing do voluptate cupidatat anim officia quis adipisicing. Enim nisi consectetur deserunt dolore id Lorem et cillum reprehenderit qui consectetur excepteur. Consequat mollit tempor elit deserunt reprehenderit et ullamco consectetur excepteur. Excepteur et laboris consectetur et reprehenderit velit. Elit ut occaecat commodo elit fugiat. Quis dolor incididunt est elit fugiat elit mollit irure eiusmod voluptate tempor officia duis sunt.\r\n',
    'imgUrl': 'https://picsum.photos/600/1000',
    'startDate': '2020-07-27T02:08:41',
    'endDate': '2020-08-20T06:05:29',
    'address': '410 Dunne Court, Ogbomosho,  Kano State, 6481',
    'organizer': 'Atgen',
    'location': {
      'type': 'point',
      'coordinates': [12.211365, 10.183174],
    },
    'subscribed': Set([
      '5efb83a8ae1333edc786f59c',
      '5efb83a88d51cca6bb19bf24',
      '5efb83a895aec9e34c46dd4e',
      '5efb83a80ec13c758cc95571',
      '5efb83a80adeae012f4cd26c',
      '5efb83a84280ad4b3d0d1e8c',
      '5efb83a803c0b50b3caa9734',
      '5efb83a8604e083fdd3e17a5',
      '5efb83a8f78594992c697dd2',
      '5efb83a8d2728a35b7b61fd1',
      '5efb83a8dcd048ec81a22d4f',
      '5efb83a87b4ef6ce7915c3d1',
      '5efb83a88e94c8d5f5927a5c',
      '5efb83a87782824048418249',
      '5efb83a814f01f16494787f1',
      '5efb83a8b18df6dbe62e5bac',
      '5efb83a822566b1e6f7c9091',
      '5efb83a8f92699b8f834600e',
      '5efb83a89253d4720f98ffb2',
      '5efb83a837261d9af401c1f4',
    ]),
    'createdAt': '2020-07-16T06:47:53',
    'updatedAt': '2020-07-04T10:03:45',
  },
]) as Event[];

export const Default = () => ({
  component: EventCardComponent,
  template: `
    <div style="padding: 3rem">
    <app-event-card [event]="event" (dateCardClicked)="dateCardClicked($event)"></app-event-card>
    </div>
  `,
  props: {
    event: singleEventData.copyWith({ name: 'Default Test' }),
    imageLoaded: action('Image loaded!'),
    dateCardClicked: action('Date card clicked!'),
  },
});

Default.story = {
  parameters: {
    notes: 'The event state in a default manner',
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};

export const Row4 = () => ({
  component: EventCardComponent,
  template: `
    <div style="padding: 3rem; display: flex; flex-direction:'row' height: 250px; min-width: 800px; margin: 0 auto;">
      <app-event-card [event]="multipleEventsData[0]" (dateCardClicked)="dateCardClicked($event)"  [loading]="true" style="margin-right: 10px;" (imageLoaded)="onImageLoaded($event)"></app-event-card>
      <app-event-card [event]="multipleEventsData[1]" (dateCardClicked)="dateCardClicked($event)" (imageLoaded)="onImageLoaded($event)" style="margin-right: 10px;"></app-event-card>
      <app-event-card [event]="multipleEventsData[2]" (dateCardClicked)="dateCardClicked($event)"  [loading]="true" (onImageLoaded)="imageLoaded($event)" style="margin-right: 10px;"></app-event-card>
      <app-event-card [event]="multipleEventsData[3]" (dateCardClicked)="dateCardClicked($event)" (imageLoaded)="onImageLoaded($event)"></app-event-card>
    </div>
  `,
  props: {
    multipleEventsData: multipleEventsData,
    onImageLoaded: action('Image loaded'),
    dateCardClicked: action('Date card clicked!'),
  },
});

Row4.story = {
  parameters: { notes: '4 Event Cards set up in  a row scenario' },
};
