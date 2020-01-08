export interface GetUserDto {
    favoriteCourses: Array<string>;
    wishList: Array<string>;
    likedArticles: Array<string>;
    dislikedArticles: Array<string>;
    eventSubscriptions: Array<string>;
    courses: Array<string>;
    archivedCourses: Array<string>;
    username: string;
    email: string;
    status: string;
    kycStatus: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    msisdn: string;
    mcc: string;
    name: string;
    middleName: string;
    lastName: string;
    gender: string;
    nameTitle: string;
    secretQuestion: string;
    secretAnswer: string;
    createdAt: Date;
    updatedAt: Date;
    purchasedCourses: Array<{ progress: Array<string>; course: string }>;
    id: string;
}
