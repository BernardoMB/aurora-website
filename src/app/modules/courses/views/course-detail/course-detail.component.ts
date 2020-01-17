import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  course = {
    public: true,
    labels: [
      'finance',
      'mathematics',
      'annuities',
      'present value',
      'money',
      'interest',
    ],
    reviews: ['5e192b2ce05ff40023656e54'],
    enrolledUsers: [
      '5e192b00e05ff40023656e53',
      '5e192b00e05ff40023656e54',
      '5e192b00e05ff40023656e55',
      '5e192b00e05ff40023656e56',
      '5e192b00e05ff40023656e57',
      '5e192b00e05ff40023656e58',
      '5e192b00e05ff40023656e59',
      '5e192b00e05ff40023656e10',
      '5e192b00e05ff40023656e11',
      '5e192b00e05ff40023656e12',
      '5e192b00e05ff40023656e13',
      '5e192b00e05ff40023656e53',
      '5e192b00e05ff40023656e54',
      '5e192b00e05ff40023656e55',
      '5e192b00e05ff40023656e56',
      '5e192b00e05ff40023656e57',
      '5e192b00e05ff40023656e58',
      '5e192b00e05ff40023656e59',
      '5e192b00e05ff40023656e10',
      '5e192b00e05ff40023656e11',
      '5e192b00e05ff40023656e12',
      '5e192b00e05ff40023656e13',
    ],
    featured: true,
    lessons: [
      {
        thumbnailsUrls: [],
        title: 'Risk and uncertainty',
        // tslint:disable-next-line: max-line-length
        description:
          // tslint:disable-next-line: max-line-length
          'We will discuss risk and uncertainty in the context of decision making processes. How does one take decisions among alternatives when there is risk? What about uncertainty? Thus, we will build a model of decision making using the concept of “Expected Utility”. This concept will be an extension of utility theory we learn in economics.',
        type: 'ARTICLE',
        article: '<p>test</p>',
        course: '5deffd13ef2fd3002404263e',
        order: 1,
        createdAt: '2019-12-10T20:16:40.046Z',
        updatedAt: '2019-12-16T09:54:46.324Z',
        readTime: 180,
        id: '5deffd28ef2fd3002404263f',
      },
      {
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
          'https://courses-euwe.streaming.media.azure.net/9c7769ff-605a-422c-95b6-54ac0124e72f/8a45abf671e0f1389f05b05a310d848f.ism/manifest(encryption=cbc)',
        readTime: null,
        id: '5df023246c985f0024febd91',
      },
      {
        thumbnailsUrls: [],
        title: 'Risk Management',
        // tslint:disable-next-line: max-line-length
        description:
          // tslint:disable-next-line: max-line-length
          'Economic success depends critically on correct risk management processes. We will study risk management via risk transfer through the system of insurance. We will study the mechanism through which risk transfer happens. Asymmetric information plays a crucial role. We will discuss: Identification, classification of risk, diversification through insurance and finance. In particular, we will examine: Moral hazard and adverse selection in the presence of asymmetric information. Economic success depends critically on correct risk management processes. We will study risk management via risk transfer through the system of insurance.',
        type: 'DOCUMENT',
        course: '5deffd13ef2fd3002404263e',
        order: 3,
        documentUrl:
          'https://auroracourses.blob.core.windows.net/lessondocuments/aece23b060b83b991dc933b28248f8cb.pdf',
        createdAt: '2019-12-10T21:42:32.064Z',
        updatedAt: '2019-12-16T09:54:46.667Z',
        readTime: 360,
        article: '<p>Test</p>',
        adaptiveStreamingUrl: '',
        id: '5df011486c985f0024febd90',
      },
      {
        thumbnailsUrls: [
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000001.png',
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000002.png',
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000003.png',
        ],
        title: 'Insurance',
        // tslint:disable-next-line: max-line-length
        description:
          // tslint:disable-next-line: max-line-length
          'Insurance works only when there are legal and contractual basis. We will take a first look at an insurance contract and analyze why the insurance clauses are there. Fundamental concepts like pure risk, insurable interest, indemnization, among others. Who are the major players?',
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
          'https://courses-euwe.streaming.media.azure.net/9c7769ff-605a-422c-95b6-54ac0124e72f/8a45abf671e0f1389f05b05a310d848f.ism/manifest(encryption=cbc)',
        readTime: null,
        id: '5df023246c985f0024febd91',
      },
      {
        thumbnailsUrls: [
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000001.png',
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000002.png',
          'https://auroracourses.blob.core.windows.net/thumbnails/Thumbnail-8a45abf671e0f1389f05b05a310d848f7-000003.png',
        ],
        title: 'Premiums, reserves and solvency',
        // tslint:disable-next-line: max-line-length
        description:
          // tslint:disable-next-line: max-line-length
          'Three fundamental concepts will be discussed. Premiums can be seen as a cost. It can also be seen as an equilibrium concept in the market. Reserves have a very special place in insurance literature. Reserves policy determines the solvency of the company selling insurance.',
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
          'https://courses-euwe.streaming.media.azure.net/9c7769ff-605a-422c-95b6-54ac0124e72f/8a45abf671e0f1389f05b05a310d848f.ism/manifest(encryption=cbc)',
        readTime: null,
        id: '5df023246c985f0024febd91',
      },
      {
        thumbnailsUrls: [],
        title: 'Insurance marketing',
        // tslint:disable-next-line: max-line-length
        description:
          // tslint:disable-next-line: max-line-length
          'Selling insurance is very special. How insurance is sold also affects the solvency of the company. Channels of distribution of insurance are unique compared with other services industry.',
        type: 'DOCUMENT',
        course: '5deffd13ef2fd3002404263e',
        order: 3,
        documentUrl:
          'https://auroracourses.blob.core.windows.net/lessondocuments/aece23b060b83b991dc933b28248f8cb.pdf',
        createdAt: '2019-12-10T21:42:32.064Z',
        updatedAt: '2019-12-16T09:54:46.667Z',
        readTime: 120,
        article: '<p>Test</p>',
        adaptiveStreamingUrl: '',
        id: '5df011486c985f0024febd90',
      },
    ],
    name: 'Insurance Priciples',
    description:
      // tslint:disable-next-line: max-line-length
      'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
    category: {
      name: 'Insurance',
      hexColor: '#cd64e0',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
      createdAt: '2020-01-13T18:21:15.917Z',
      updatedAt: '2020-01-13T18:21:15.917Z',
      id: '5e1cb51be05ff40023656e56',
    },
    price: 49,
    discount: 0,
    overview: `
      <p> Life and Health Insurance Workshop Review has 3 key focus:</p>
      <ol>
        <li>
          <p> Students can gather general knowledge about life and health insurance.</p>
        </li>
        <li>
          <p> Students can gather knowledge on how to pass the life and health insurance test and what to expect after passing the test</p>
        </li>
        <li>
          <p> Opportunity for students to use this platform to create a community of like minded
          individuals that can help each other in this journey.</p>
        </li>
      </ol>
      <p> Also because I am trying to encourage students to take the life and
      insurance test, I am committed to give 50 % of your course investment back and sponsor people that are looking take the test.</p>
      <p> For any question please reach my email: <a href="mailto:bmondragonbrozon@gmail.com"> bmondragonbrozon@gmail.com</a>.</p>
      <p> Good luck on your learning journey!</p>
      <p> Your instructor </p>
      <h2>
        <a></a>Who this course is for:
      </h2>
      <ul>
        <li> Actually this knowledge is currently required even if you will not take
        the insurance test.The more you know about your rights as a consumer, the
        better you can choose your agent and your insurance plan.</li>
      </ul>
    `,
    createdAt: '2020-01-11T01:28:06.561Z',
    updatedAt: '2020-01-11T01:55:58.286Z',
    imgUrl:
      'https://auroracourses.blob.core.windows.net/coursesimages/edb35a58af75eea72a8091158eaf0b37.png',
    rating: 4.6,
    totalRating: 4,
    totalReviews: 1,
    id: '5e1924a6e05ff40023656e8f',
  };

  // TODO: this should be computed from the info obtained from the server
  isFavorite: boolean;
  enrolled: boolean;
  // TODO: this should be computed from the info obtained from the server
  price: number;

  currentTab = 'about';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    // TODO: The following behaviour should not be random, instead it should be computed with the info obtained from the server
    let num = Math.random();
    this.isFavorite = num > 0.5 ? true : false;
    num = Math.random();
    this.enrolled = num > 0.5 ? true : false;

    // TODO: The following behaviour should not be random, instead it should be computed with the info obtained from the server
    num = Math.random();
    this.price = num * (0 - 100) + 100;
  }
}
