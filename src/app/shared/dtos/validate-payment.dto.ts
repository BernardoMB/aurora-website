export interface ValidatePaymentDto {
  transactionReference: string;
  paymentReference: string;
  otp: string;
  isBankAccount?: boolean;
}
