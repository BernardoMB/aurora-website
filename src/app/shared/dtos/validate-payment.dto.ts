export interface ValidatePaymentDto {
  transactionReference: string;
  internalTransactionReference: string;
  otp: string;
  isBankAccount?: boolean;
}
