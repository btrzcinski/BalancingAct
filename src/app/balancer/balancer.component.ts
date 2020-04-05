import {Component, DoCheck, Input, IterableDiffer, IterableDiffers, OnInit} from '@angular/core';
import {HoldingModel} from '../models/holding-model';
import {BalancerService} from './balancer.service';

@Component({
  selector: 'app-balancer',
  templateUrl: './balancer.component.html',
  styleUrls: ['./balancer.component.css']
})
export class BalancerComponent implements OnInit, DoCheck {
  @Input() holdings: HoldingModel[];
  private arrayDiffer: IterableDiffer<HoldingModel>;

  balancedHoldings: HoldingModel[];

  constructor(differs: IterableDiffers, private balancer: BalancerService) {
    this.arrayDiffer = differs.find([]).create();
  }

  totalTargetAllocation = 0;

  ngDoCheck(): void {
    if (this.arrayDiffer.diff(this.holdings)) {
      this.updateBalancedPortfolio();
    }
  }

  private updateBalancedPortfolio() {
    this.totalTargetAllocation = this.holdings.map(h => h.targetAllocation)
      .reduce((p, v) => p + v, 0);
    if (this.totalTargetAllocation === 1) {
      this.balancedHoldings = this.balancer.createBalancePlan(this.holdings);
    }
  }

  ngOnInit(): void {
  }

}
