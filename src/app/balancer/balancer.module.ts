import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalancerComponent } from './balancer.component';
import {PortfolioModule} from '../portfolio/portfolio.module';
import { TransactionPlanComponent } from './transaction-plan/transaction-plan.component';



@NgModule({
  declarations: [BalancerComponent, TransactionPlanComponent],
  imports: [
    CommonModule,
    PortfolioModule
  ],
  exports: [
    BalancerComponent
  ]
})
export class BalancerModule { }
