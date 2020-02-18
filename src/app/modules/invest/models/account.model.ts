import { Transaction } from './transaction.model';

export interface Account {
  overallBalance: number;
  currentMonthWithdrawals: number;
  currentMonthDeposits: number;
  transactions: Transaction[];
}
