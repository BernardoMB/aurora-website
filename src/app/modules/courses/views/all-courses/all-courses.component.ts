import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss'],
})
export class AllCoursesComponent implements OnInit, OnDestroy {
  // TODO: this courses array will be obatined by a call to the server with pagination
  // Fake data
  courses1 = [
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
      name: 'Financial Mathematics I',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Finance',
        hexColor: '#00BFFF',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/6af3a663dd26940d279e3d3758d62669.png',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e55',
      },
      price: 125,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
      rating: 4,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e4f',
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
      name: 'Accounting Basics',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Accounting',
        hexColor: '#ff7ae5',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/aa61e344ea7386c08fade32e77acffff.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e58',
      },
      price: 12,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/cbd16482f7a317f790b3c6825b47599b.jpg',
      rating: 4.8,
      totalRating: 4.9,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e5f',
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
      name: 'Azure Active Directory',
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
      price: 1,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/cf62a422d6221f790acfe6554f8a010d5.jpg',
      rating: 2.9,
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
      name: 'Financial Mathematics II',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Finance',
        hexColor: '#00BFFF',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/6af3a663dd26940d279e3d3758d62669.png',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e55',
      },
      price: 110,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/ab424107b50b21619696261e6e0db7af6.jpg',
      rating: 5,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e6f',
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
      name: 'Consumer Theory',
      description:
        // tslint:disable-next-line: max-line-length
        'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
      category: {
        name: 'Economy',
        hexColor: '#ffc107',
        imgUrl:
          'https://auroracourses.blob.core.windows.net/categoryimages/ed1aaf16c28b653d0fcc1fccb9472879.jpg',
        createdAt: '2020-01-13T18:21:15.917Z',
        updatedAt: '2020-01-13T18:21:15.917Z',
        id: '5e1cb51be05ff40023656e57',
      },
      price: 65,
      discount: 0,
      overview:
        // tslint:disable-next-line: max-line-length
        'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
      createdAt: '2020-01-11T01:28:06.561Z',
      updatedAt: '2020-01-11T01:55:58.286Z',
      imgUrl:
        'https://auroracourses.blob.core.windows.net/coursesimages/10cc59730fb25927a892a42e57295383d.jpg',
      rating: 3.7,
      totalRating: 4,
      totalReviews: 1,
      id: '5e1924a6e05ff40023656e7f',
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
      discount: 0,
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

  coursesSubscription: Subscription;
  courses: Course[];

  constructor(
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.coursesSubscription = this.coursesService.getRecentCourses(undefined, undefined).subscribe((courses: Course[]) => {
      if (courses && courses.length > 0) {
        this.courses = courses;
      }
    });
  }

  ngOnDestroy() {
    this.coursesSubscription.unsubscribe();
  }
}
