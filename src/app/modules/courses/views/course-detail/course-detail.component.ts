import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, UrlSegment } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User } from '../../../../shared/models/user.model';
import { selectAuthUser, selectAuthIsAuthenticated, selectAuthCart } from '../../../../store/auth/auth.selectors';
import { CoursesService } from '../../services/courses.service';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { addCourseToCart, pushCourseToCarts } from '../../../../store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
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

  currentTab = 'about';
  showCertificateTab = false;
  userSubscription: Subscription;
  user: User;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated = false;
  courseSubscription: Subscription;
  course: Course;
  showGoToCart = false;
  get enrolled() {
    if (this.user && this.course) {
      if (this.course.enrolledUsers.indexOf(this.user.id) !== -1) {
        return true;
      }
    }
    return false;
  }

  constructor(
    private router: Router,
    private store: Store<State>,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private cookieService: CookieService
  ) {
    this.router.events.subscribe(event => {
      /* console.log('Navigation event:', event); */
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const second = event.url.split('#')[1];
        if (second) {
          return;
        }
        window.scrollTo(0, 0);
      }
      return;
    });

    this.route.url.subscribe((url: UrlSegment[]) => {
      const courseId = url[0].path;
      this.getCourse(courseId);
    });
  }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.showCertificateTab = true;
      } else {
        this.user = undefined;
        this.showCertificateTab = false;
      }
    });
    this.isAuthenticatedSubscription = this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
  }

  getCourse(courseId: string) {
    this.courseSubscription = this.coursesService.getCourse(courseId).subscribe((course: Course) => {
      if (course) {
        this.course = course;
        this.store.pipe(select(selectAuthCart)).subscribe((cart: any[]) => {
          if (cart) {
            if (cart.length > 0) {
              cart.map((el: Course) => {
                return el.id;
              }).indexOf(course.id) !== -1 ? this.showGoToCart = true : this.showGoToCart = false;
            } else {
              this.showGoToCart = false;
            }
          }
        });
      }
    });
  }

  onAddToCart(courseId: string) {
    if (this.isAuthenticated) {
      this.store.dispatch(addCourseToCart({ courseId, userId: this.user.id }));
    } else {
      let courseIds: string[] = [];
      const cartCookie: string = this.cookieService.get('cartCookie');
      if (cartCookie) {
        courseIds = JSON.parse(cartCookie);
      }
      courseIds.push(this.course.id);
      this.cookieService.delete('cartCookie');
      this.cookieService.set('cartCookie', JSON.stringify(courseIds));
      this.store.dispatch(pushCourseToCarts(this.course));
    }
  }

  onBuyNow() {
    if (this.user) {
      alert('Redirect courses/cart/checkout/express/course/:courseId');
    } else {
      // There is no logged in user
      // TODO: Pass the following message to the modal: Please login to purchase this course
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'custom-mat-dialog-container';
      dialogConfig.backdropClass = 'custom-modal-backdrop';
      let loginDialogRef;
      let signupDialogRef;
      loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
      loginDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.showSignUpModalOnClose) {
            signupDialogRef = this.signupDialog.open(SignupFormComponent, dialogConfig);
          }
          if (result.userIsLoggedIn) {
            alert('Redirect courses/cart/checkout/express/course/:courseId')
          }
        }
      });
    }
  }

}
