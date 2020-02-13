import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '../../../../store/state';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAuthCart, selectAuthState } from '../../../../store/auth/auth.selectors';
import { Course } from '../../../../shared/models/course.model';
import { User } from '../../../../shared/models/user.model';
import { AuthState } from '../../../../store/auth/auth.state';
import { CookieService } from 'ngx-cookie-service';
import { pullCourseFromCarts, removeCourseFromCart } from '../../../../store/auth/auth.actions';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  // TODO: this info shpould come from the back end
  /* cart = [
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
      name: 'Insurance Priciples',
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
      price: 49,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/edb35a58af75eea72a8091158eaf0b37.png',
      rating: 4.6,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e8f',
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
      discount: 0.3,
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
      name: 'Introduction to Cloud Services',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'IT & Software',
        hexColor: '#345cbd',
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
        'https://auroracourses.blob.core.windows.net/coursesimages/da8a220cab32ecb33f7a1082b5e8f96f5.jpg',
      rating: 5,
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
      discount: 0.2,
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
      name: 'Microsoft Azure: Beginner Bootcamp',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'IT & Software',
        hexColor: '#345cbd',
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
        'https://auroracourses.blob.core.windows.net/coursesimages/5840715ec5149b8967960276ad92e1022.jpg',
      rating: 4.4,
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
      discount: 0.4,
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
  ]; */

  wishList = [
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
      discount: 0.5,
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
      name: "Microsoft Azure: Beginner's Guide",
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'IT & Software',
        hexColor: '#345cbd',
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
        'https://auroracourses.blob.core.windows.net/coursesimages/17dd5367e4b681aedc4fa4fd52e810b36.jpg',
      rating: 4.4,
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
      name: 'Getting started on Microsoft Azure',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'IT & Software',
        hexColor: '#345cbd',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/705851dcfab771036477382d35b3f1545.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e56',
      },
      price: 0,
      discount: 0.3,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/43f29b6d0c16a99359ab07e7cf281c19.jpg',
      rating: 3.2,
      totalRating: 3.4,
      totalReviews: 1,
      id: '5e1924a6e05ff4002365613f',
    },
  ];

  // Accesor properties

  get subtotal() {
    let subtotal = 0;
    if (this.cart) {
      this.cart.forEach(course => {
        subtotal = subtotal + course.price;
      });
      return subtotal;
    }
    return 0;
  }
  get total() {
    let total = 0;
    if (this.cart) {
      this.cart.forEach(course => {
        total = total + course.price * (1 - course.discount);
      });
      return total;
    }
    return 0;
  }
  cartSubscription: Subscription;
  cart: Course[];
  authStateSubcription: Subscription;
  user: User;
  isAuthenticated: boolean;

  constructor(
    private store: Store<State>,
    private cookieService: CookieService,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.cartSubscription = this.store.pipe(select(selectAuthCart)).subscribe((cart: Course[]) => {
      if (cart) {
        this.cart = cart;
      }
    });
    this.authStateSubcription = this.store.pipe(select(selectAuthState)).subscribe((authState: AuthState) => {
      if (authState.user) {
        this.user = authState.user;
      } else {
        this.user = undefined;
      }
      if (authState.isAuthenticated) {
        this.isAuthenticated = authState.isAuthenticated;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.authStateSubcription.unsubscribe();
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.isAuthenticated) {
      this.store.dispatch(removeCourseFromCart({ courseId: course.id, userId: this.user.id }));
    } else {
      let courseIds: string[] = [];
      const cartCookie: string = this.cookieService.get('cartCookie');
      if (cartCookie) {
        courseIds = JSON.parse(cartCookie);
      }
      const newCourseIds = courseIds.filter((id: string) => id !== course.id);
      this.cookieService.delete('cartCookie');
      this.cookieService.set('cartCookie', JSON.stringify(newCourseIds));
      this.store.dispatch(pullCourseFromCarts({ course }));
    }
  }

  onCheckout() {
    if (this.isAuthenticated) {
      /* alert('Redirect courses/cart/checkout/'); */
      console.log('CartComponent: Authenticated state is true. Navigating to /courses/cart/checkout');
      this.router.navigate(['./courses/cart/checkout']);
    } else {
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
          if (this.isAuthenticated) {
            /* alert('Redirect courses/cart/checkout/'); */
            console.log('CartComponent: Authenticated state is true. Navigating to /courses/cart/checkout');
            this.router.navigate(['./courses/cart/checkout']);
          }
        }
      });
    }
  }
}
