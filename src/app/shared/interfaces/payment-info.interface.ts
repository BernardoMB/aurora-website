export interface IPaymentInfo {
  nameOnCard?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  securityCode?: string;
  pin?: string;
  rememberCard?: boolean;
  userCardId?: string;
  accountBank?: string;
  accountNumber?: string;
  bvn?: string;
  passcode?: string;
  firstName?: string;
  lastName?: string;
  billingzip?: string;
  billingcity?: string;
  billingaddress?: string;
  billingstate?: string;
  billingcountry?: string;
  suggested_auth?: string;
  redirect_url?: string;
}
