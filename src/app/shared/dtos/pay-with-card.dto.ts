export interface PayWithCardDto {
  accountName: string;
  cardno: string;
  expirymonth: string;
  expiryyear: string;
  currency: string;
  country: string;
  amount: string;
  email?: string;
  phonenumber?: string;
  firstname: string;
  lastname: string;
  pin?: string; // Optional, sent when an additional verification process is carried out.
}
