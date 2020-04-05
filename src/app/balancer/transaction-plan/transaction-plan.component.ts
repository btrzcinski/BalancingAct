import {Component, Input} from '@angular/core';
import {HoldingModel} from '../../models/holding-model';

@Component({
  selector: 'balancer-transaction-plan',
  templateUrl: './transaction-plan.component.html',
  styleUrls: ['./transaction-plan.component.css']
})
export class TransactionPlanComponent {
  @Input()
  public oldHoldings: HoldingModel[];

  @Input()
  public newHoldings: HoldingModel[];
}
