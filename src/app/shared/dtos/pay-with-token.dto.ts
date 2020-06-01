export interface PayWithTokenDto {
  token: string;
  currency: string;
  country: string;
  amount: string;
  email: string;
  firstname: string;
  lastname: string;
  device_fingerprint?: string;
}
