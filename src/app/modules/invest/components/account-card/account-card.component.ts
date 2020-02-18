import { Component, OnInit, Input } from '@angular/core';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss'],
})
export class AccountCardComponent implements OnInit {
  @Input() account: Account;

  constructor() {}

  ngOnInit() {}
}
