import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User } from '../../../../shared/models/user.model';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  user: User;
  showCertificateTab = false;

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
    reviews: [
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/a4c9130109ce4918fca3cedc9e78541039.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        review:
          'El curso esta muy básico. Certainly enjoying the course so far, crystal clear explanations. Looking forward for more!',
        rating: 3.8,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/6ab175d926dc4442b956ce100aa6da1084.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        review: 'Principios de un largo camino...',
        rating: 5,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/b3a4717d145cf356144df1769317b449.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        // tslint:disable-next-line: max-line-length
        review:
          'No profundiso sufienciente en los temas. For the kind of study I am most interested in, I would say that the teacher glosses over key math concepts and focuses on the intuition behind it. I respect this approach since the class is more oriented towards the 20 Case Studies. Overall, I very much appreciate the fluidity of the lessons and the wide range of topics covered.',
        rating: 4.5,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/24d219cd38f84810fb847f1d39d5e608.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        review: 'Gracias! Pasé mi materia (:',
        rating: 4.8,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/455973f31bf285d388abb76383f9c92f.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        review: 'El peor curso que visto en mi vida',
        rating: 1.1,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
      {
        user: {
          profilePicMiniUrl:
            'https://auroracourses.blob.core.windows.net/coursesimages/0af6514c9802815b71179732b699e7ae.jpg',
        },
        course: '5e212c4d3357dd2c109ee2cf',
        // tslint:disable-next-line: max-line-length
        review: `Excellent overview of the key topic areas of ML. Course is supported by plenty of practical examples that provide hands-on experience and reinforce learning with the types of problems one is likely to encounter in the world. Some of the lessons are jerky due to jumping quickly in and out of different slides. Slower transitions or a more calculated approach would soften these sometimes hard edges. It is pretty different in format, from others. The appraoch taken here is an end-to-end hands-on project execution, while introducing the concepts. A learner with some prior knowledge will definitely feel at home and get to witness the thought process that happens, while executing a real-time project.`,
        rating: 4,
        createdAt: '2020-01-17T03:54:16.656Z',
        updatedAt: '2020-01-17T03:54:16.656Z',
        id: '5e212fe83497412ef81950d7',
      },
    ],
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
    totalReviews: 5,
    id: '5e1924a6e05ff40023656e8f',
  };

  relatedCourses = [
    {
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
      enrolledUsers: ['5e192b00e05ff40023656e53'],
      featured: true,
      lessons: [
        '5e192643e05ff40023656e50',
        '5e19268be05ff40023656e51',
        '5e192691e05ff40023656e52',
      ],
      name: 'Actuarial Mathematics',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Business',
        hexColor: '#ff5722',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 15,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/3910105dbc58cdfc227ab2576971c3a40a.jpg',
      rating: 4,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e9f',
    },
    {
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
      enrolledUsers: ['5e192b00e05ff40023656e53'],
      featured: true,
      lessons: [
        '5e192643e05ff40023656e50',
        '5e19268be05ff40023656e51',
        '5e192691e05ff40023656e52',
      ],
      name: 'How to become an Actuary',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Business',
        hexColor: '#ff5722',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 0,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/49cf96b76071f4eb6342ae4c44baf010a.jpg',
      rating: 4.3,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff4002365610f',
    },
    {
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
      enrolledUsers: ['5e192b00e05ff40023656e53'],
      featured: true,
      lessons: [
        '5e192643e05ff40023656e50',
        '5e19268be05ff40023656e51',
        '5e192691e05ff40023656e52',
      ],
      name: 'Actuarial Philosophy',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Business',
        hexColor: '#ff5722',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 15,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/1de10fae9910524d93e5a715dfeb8408e6.jpg',
      rating: 4,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff4002365611f',
    },
    {
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
      enrolledUsers: ['5e192b00e05ff40023656e53'],
      featured: true,
      lessons: [
        '5e192643e05ff40023656e50',
        '5e19268be05ff40023656e51',
        '5e192691e05ff40023656e52',
      ],
      name: 'The Actuarial Profession: Basic Sciences and Principles',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Business',
        hexColor: '#ff5722',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 14.33,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/cb10d3dae63cf967988270cbba72ca24f.jpg',
      rating: 3.4,
      totalRating: 3.4,
      totalReviews: 1,
      id: '5e1924a6e05ff4002365613f',
    },
    {
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
      enrolledUsers: ['5e192b00e05ff40023656e53'],
      featured: true,
      lessons: [
        '5e192643e05ff40023656e50',
        '5e19268be05ff40023656e51',
        '5e192691e05ff40023656e52',
      ],
      name: 'What does an actuary actually do?',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Business',
        hexColor: '#ff5722',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 12,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/dfba9a10584e633a7dcd2d493a3a9f8c.jpg',
      rating: 4,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff4002365612f',
    },
  ];

  // TODO: this should be computed from the info obtained from the server
  isFavorite: boolean;
  enrolled: boolean;
  // TODO: this should be computed from the info obtained from the server
  price: number;

  currentTab = 'about';

  constructor(private router: Router, private store: Store<State>) {
    this.router.events.subscribe(event => {
      console.log('\n\n\n');
      console.log('Navigation event', event);
      console.log('\n\n\n');
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const second = event.url.split('#')[1];
        if (second) {
          console.log('\n\n\n');
          console.log('Second', second);
          console.log('\n\n\n');
          return;
        }
        console.log('\n\n\n');
        console.log('Second', second);
        console.log('Scrolling...');
        console.log('\n\n\n');
        window.scrollTo(0, 0);
      }
      return;
    });
  }

  ngOnInit() {
    this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.showCertificateTab = true;
      } else {
        this.user = undefined;
        this.showCertificateTab = false;
      }
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
