import { Injectable } from '@angular/core';
import { PayWithBankDto } from '../shared/dtos/pay-with-bank.dto';
import { ValidatePaymentDto } from '../shared/dtos/validate-payment.dto';
import { PayWithTokenDto } from '../shared/dtos/pay-with-token.dto';
import { PayWithCardDto } from '../shared/dtos/pay-with-card.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly url = `${environment.host}/${environment.apiVersion}/payments`;

  constructor(private http: HttpClient) {}

  payWithCard(dto: PayWithCardDto) {
    return this.http.post(`${this.url}/card`, dto);
  }

  payWithCardToken(dto: PayWithTokenDto) {
    return this.http.post(`${this.url}/card/token`, dto);
  }

  getAvailableBanks() {
    return this.http.get(`${this.url}/banks`);
  }

  payWithBank(dto: PayWithBankDto) {
    return this.http.post(`${this.url}/bank`, dto);
  }

  validatePayment(dto: ValidatePaymentDto) {
    return this.http.post(`${this.url}/validate`, dto);
  }
}
