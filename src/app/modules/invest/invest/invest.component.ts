import {
  Component,
  OnInit,
  ɵCompiler_compileModuleSync__POST_R3__,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpressionOfInterestModalComponent } from '../components/expression-of-interest-modal/expression-of-interest-modal.component';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/account.model';
import { map } from 'rxjs/operators';
import { ExpressionOfInterest } from '../models/expression-of-interest.model';
import {
  Operation,
  TransactionType,
  Transaction,
} from '../models/transaction.model';
import { IpoModalComponent } from '../components/ipo-modal/ipo-modal.component';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.scss'],
})
export class InvestComponent implements OnInit {
  dummyAcount$ = new BehaviorSubject<Account>({
    overallBalance: 2948093.37,
    currentMonthWithdrawals: 302934.4,
    currentMonthDeposits: 231058.79,
    transactions: [],
  });

  transactions$ = this.dummyAcount$.pipe(map(dA => dA.transactions));

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit() {}

  onOpenExpressionOfInterestModal() {
    const dialogRef = this.dialog.open(ExpressionOfInterestModalComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.addExpressionOfInterest(result);
      }
    });
  }

  onRowSelected(row: { transaction: Transaction; index: number }) {
    this.onOpenIpoBuyModal(row);
  }

  onOpenIpoBuyModal(e: { transaction: Transaction; index: number }) {
    const dialogRef = this.dialog.open(IpoModalComponent, {
      width: '400px',
      data: e,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.addIPOBuy(result);
      }
    });
  }

  addExpressionOfInterest(eOfI: ExpressionOfInterest) {
    const prevValue = this.dummyAcount$.value;
    const newValue: Account = {
      ...prevValue,
      transactions: [
        ...prevValue.transactions,
        {
          operation: Operation.Submit,
          amount: eOfI.availableInvestment,
          performedDate: eOfI.performedDate,
          transactionType: TransactionType.ExpressionOfInterest,
          extra: eOfI,
        },
      ],
    };
    this.dummyAcount$.next(newValue);
  }

  addIPOBuy({
    transaction,
    index,
    desiredShares,
    amountToPay,
    performedDate,
  }: {
    transaction: Transaction;
    index: number;
    desiredShares: number;
    amountToPay: number;
    performedDate: Date;
  }) {
    const prevValue = this.dummyAcount$.value;
    const newValue: Account = {
      ...prevValue,
      transactions: [
        ...prevValue.transactions.slice(0, index),
        ...prevValue.transactions.slice(index + 1),
        {
          operation: Operation.Fund,
          amount: `${amountToPay}`,
          performedDate,
          transactionType: TransactionType.IPOBuy,
          extra: {
            ...transaction.extra,
            desiredShares,
            amountToPay,
          },
        },
      ],
    };
    this.dummyAcount$.next(newValue);
  }
}
