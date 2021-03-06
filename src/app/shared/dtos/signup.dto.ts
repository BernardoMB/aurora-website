export interface SignupDto {
    username: string;
    email: string;
    password: string;
    msisdn: string;
    cc: string;
    name: string;
    middleName?: string;
    lastName: string;
    gender: string;
    nameTitle?: string;
    secretQuestion: string;
    secretAnswer: string;
}
