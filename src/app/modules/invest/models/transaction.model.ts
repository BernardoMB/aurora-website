export enum TransactionType {
  ExpressionOfInterest = 'ExpressionOfInterest',
  IPOBuy = 'IPOBuy',
}

export enum Operation {
  Fund = 'Fund',
  CashOut = 'CashOut',
  Liquidate = 'Liquidate',
  Submit = 'Submit',
}

export interface Transaction {
  operation: Operation;
  amount: string;
  performedDate: Date;
  transactionType: TransactionType;
  extra?: any;
}
