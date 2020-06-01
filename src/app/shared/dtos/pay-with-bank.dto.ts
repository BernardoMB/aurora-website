export interface PayWithBankDto {
  accountbank: string; // example: '232' - get the bank code from the bank list endpoint.
  accountnumber: string; // example: '0061333471' - the bank account number.
  currency: string; //example: 'NGN'.
  country: string; //example: 'NG'.
  amount: string; //example: '10'.
  email: string; //example: 'desola.ade1@gmail.com'
  passcode?: string; // example: '09101989' - customer Date of birth this is required for Zenith bank account payment.
  bvn: string; //example: '12345678901'
  phonenumber?: string; //example: '0902620185'
  firstname: string; //example: 'temi'
  lastname: string; //example : 'desola';
  device_fingerprint?: string; //exammple '69e6b7f0b72037aa8428b70fbe03986c' - used for push notifications and similar services.
}
