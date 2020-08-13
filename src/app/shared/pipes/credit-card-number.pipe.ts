import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardNumber',
})
export class CreditCardNumberPipe implements PipeTransform {
  transform(value: any): string {
    const newValue = value.toString().replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
    return newValue;
  }
}
