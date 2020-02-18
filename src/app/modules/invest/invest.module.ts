import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestComponent } from './invest/invest.component';
import { InvestRoutingModule } from './invest-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ExpressionOfInterestModalComponent } from './components/expression-of-interest-modal/expression-of-interest-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpressionOfInterestReviewComponent } from './components/expression-of-interest-review/expression-of-interest-review.component';
import { IpoModalComponent } from './components/ipo-modal/ipo-modal.component';
import { IpoReviewComponent } from './components/ipo-review/ipo-review.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { AccountCardComponent } from './components/account-card/account-card.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    InvestComponent,
    ExpressionOfInterestModalComponent,
    ExpressionOfInterestReviewComponent,
    IpoModalComponent,
    IpoReviewComponent,
    TransactionsTableComponent,
    AccountCardComponent,
  ],
  imports: [
    CommonModule,
    InvestRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MaterialModule,
  ],
  entryComponents: [ExpressionOfInterestModalComponent, IpoModalComponent],
})
export class InvestModule {}
