import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
    // TODO: this courses array will be obatined by a call to the server with pagination
    // Fake data
    featuredCourses = [
        {
            'public': true,
            'labels': [
                'finance',
                'mathematics',
                'annuities',
                'present value',
                'money',
                'interest',
            ],
            'reviews': ['5e192b2ce05ff40023656e54'],
            'enrolledUsers': ['5e192b00e05ff40023656e53'],
            'featured': true,
            'lessons': [
                '5e192643e05ff40023656e50',
                '5e19268be05ff40023656e51',
                '5e192691e05ff40023656e52',
            ],
            'name': 'Financial Mathematics I',
            'description':
                'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
            'category': 'Finance',
            'price': 125,
            'discount': 0,
            'overview':
                'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
            'createdAt': '2020-01-11T01:28:06.561Z',
            'updatedAt': '2020-01-11T01:55:58.286Z',
            'imgUrl':
                'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
            'rating': '4',
            'totalRating': 4,
            'totalReviews': 1,
            'id': '5e1924a6e05ff40023656e4f',
        },
        {
            'public': true,
            'labels': [
                'finance',
                'mathematics',
                'annuities',
                'present value',
                'money',
                'interest',
            ],
            'reviews': ['5e192b2ce05ff40023656e54'],
            'enrolledUsers': ['5e192b00e05ff40023656e53'],
            'featured': true,
            'lessons': [
                '5e192643e05ff40023656e50',
                '5e19268be05ff40023656e51',
                '5e192691e05ff40023656e52',
            ],
            'name': 'Financial Mathematics I',
            'description':
                'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
            'category': 'Finance',
            'price': 125,
            'discount': 0,
            'overview':
                'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
            'createdAt': '2020-01-11T01:28:06.561Z',
            'updatedAt': '2020-01-11T01:55:58.286Z',
            'imgUrl':
                'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
            'rating': '4',
            'totalRating': 4,
            'totalReviews': 1,
            'id': '5e1924a6e05ff40023656e5f',
        },
        {
            'public': true,
            'labels': [
                'finance',
                'mathematics',
                'annuities',
                'present value',
                'money',
                'interest',
            ],
            'reviews': ['5e192b2ce05ff40023656e54'],
            'enrolledUsers': ['5e192b00e05ff40023656e53'],
            'featured': true,
            'lessons': [
                '5e192643e05ff40023656e50',
                '5e19268be05ff40023656e51',
                '5e192691e05ff40023656e52',
            ],
            'name': 'Financial Mathematics I',
            'description':
                'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
            'category': 'Finance',
            'price': 125,
            'discount': 0,
            'overview':
                'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
            'createdAt': '2020-01-11T01:28:06.561Z',
            'updatedAt': '2020-01-11T01:55:58.286Z',
            'imgUrl':
                'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
            'rating': '4',
            'totalRating': 4,
            'totalReviews': 1,
            'id': '5e1924a6e05ff40023656e6f',
        },
        {
            'public': true,
            'labels': [
                'finance',
                'mathematics',
                'annuities',
                'present value',
                'money',
                'interest',
            ],
            'reviews': ['5e192b2ce05ff40023656e54'],
            'enrolledUsers': ['5e192b00e05ff40023656e53'],
            'featured': true,
            'lessons': [
                '5e192643e05ff40023656e50',
                '5e19268be05ff40023656e51',
                '5e192691e05ff40023656e52',
            ],
            'name': 'Financial Mathematics I',
            'description':
                'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
            'category': 'Finance',
            'price': 125,
            'discount': 0,
            'overview':
                'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
            'createdAt': '2020-01-11T01:28:06.561Z',
            'updatedAt': '2020-01-11T01:55:58.286Z',
            'imgUrl':
                'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
            'rating': '4',
            'totalRating': 4,
            'totalReviews': 1,
            'id': '5e1924a6e05ff40023656e7f',
        },
        {
            'public': true,
            'labels': [
                'finance',
                'mathematics',
                'annuities',
                'present value',
                'money',
                'interest',
            ],
            'reviews': ['5e192b2ce05ff40023656e54'],
            'enrolledUsers': ['5e192b00e05ff40023656e53'],
            'featured': true,
            'lessons': [
                '5e192643e05ff40023656e50',
                '5e19268be05ff40023656e51',
                '5e192691e05ff40023656e52',
            ],
            'name': 'Financial Mathematics I',
            'description':
                'Financial Mathematics is the application of mathematical methods to financial problems. (Equivalent names sometimes used are quantitative finance, financial engineering, mathematical finance, and computational finance.) It draws on tools from probability, statistics, stochastic processes, and economic theory.',
            'category': 'Finance',
            'price': 125,
            'discount': 0,
            'overview':
                'Traditionally, investment banks, commercial banks, hedge funds, insurance companies, corporate treasuries, and regulatory agencies apply the methods of financial mathematics to such problems as derivative securities valuation, portfolio structuring, risk management, and scenario simulation. Industries that rely on commodities (e.g. energy, manufacturing) also use financial mathematics. Quantitative analysis has brought efficiency and rigor to financial markets and to the investment process and is becoming increasingly important in regulatory concerns. \nQuantitative Finance as a sub-field of economics concerns itself with the valuation of assets and financial instruments as well as the allocation of resources. Centuries of experience have produced fundamental theories about the way economies function and the way we value assets. Models describe relationships between fundamental variables such as asset prices, market movements and interest rates. These mathematical tools allow us to draw conclusions that can be otherwise difficult to find or not immediately obvious from intuition. An example of the application of models is stress-testing of banks.  Especially with the aid of modern computational techniques, we can store vast quantities of data and model many variables simultaneously, leading to the ability to model quite large and complicated systems. Thus the techniques of scientific computing, such as numerical analysis, Monte Carlo simulation and optimization are an important part of financial mathematics. \nA large part of any science is the ability to create testable hypotheses based on a fundamental understanding of the objects of study and prove or contradict the hypotheses through repeatable studies. In this light, mathematics is the language for representing theories and provides tools for testing their validity. For example, in the theory of option pricing due to Black, Scholes and Merton, a model for the movement of stock prices is presented, and in conjunction with theory which states that a riskless investment will receive the risk-free rate of return, the researchers reasoned that a value can be assigned to an option. \nThis theory, for which Scholes and Merton were awarded the Nobel prize, is an excellent illustration of the interaction between math and financial theory, which ultimately led to a surprising insight into the nature of option prices. The mathematical contribution was the basic stochastic model (Geometric Brownian motion) for stock price movements and the partial differential equation and its solution providing the relationship between the option’s value and other market variables. Their analysis also provided a completely specified strategy for managing option investment which permits practical testing of the model’s consequences. This theory, which would not have been possible without the fundamental participation of mathematics, today plays an essential role in a trillion dollar industry.',
            'createdAt': '2020-01-11T01:28:06.561Z',
            'updatedAt': '2020-01-11T01:55:58.286Z',
            'imgUrl':
                'https://auroracourses.blob.core.windows.net/coursesimages/d6e95b10a55f7b8a125bf66ce4a2a8ba5.png',
            'rating': '4',
            'totalRating': 4,
            'totalReviews': 1,
            'id': '5e1924a6e05ff40023656e8f',
        },
    ];

    constructor() {}

    ngOnInit() {}
}
