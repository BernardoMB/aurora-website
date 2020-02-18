import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent implements OnInit {
  displayedColumns: string[] = ['operation', 'type', 'amount', 'performedDate'];
  operationColors = {
    Fund: '#306F5E',
    CashOut: '#58A583',
    Liquidate: '#4FAC60',
    Submit: '#EB7E00',
  };
  transactionTypes = {
    ExpressionOfInterest: 'Expression of interest',
    IPOBuy: 'IPO buy',
  };

  @Input() dataSource: Transaction[] = [];
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onRowSelected = new EventEmitter<{
    transaction: Transaction;
    index: number;
  }>();
  constructor() {}

  ngOnInit() {}
}
