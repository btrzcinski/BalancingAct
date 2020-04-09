import {Component, DoCheck, Input, IterableDiffer, IterableDiffers, OnInit} from '@angular/core';
import {HoldingModel} from '../models/holding';
import {BalancerService} from './balancer.service';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {mergeAll} from 'rxjs/operators';
import {Subscription} from 'rxjs';

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

  showBalancePlan = false;
  totalTargetAllocation = 0;
  private portfolioUpdateSubscription: Subscription;

  ngDoCheck(): void {
    if (this.arrayDiffer.diff(this.holdings)) {
      this.onNewArray();
    }
  }

  private onNewArray(): void {
    if (this.portfolioUpdateSubscription) {
      this.portfolioUpdateSubscription.unsubscribe();
    }

    this.portfolioUpdateSubscription =
      fromArray(this.holdings.map(h => h.quote$))
        .pipe(mergeAll())
        .subscribe(_ => this.updateBalancedPortfolio());

    this.updateBalancedPortfolio();
  }

  private updateBalancedPortfolio() {
    this.totalTargetAllocation = this.holdings.map(h => h.targetAllocation)
      .reduce((p, v) => p + v, 0);
    if (Math.abs(1 - this.totalTargetAllocation) < Number.EPSILON) {
      this.showBalancePlan = true;
      this.balancedHoldings = this.balancer.createBalancePlan(this.holdings);
    } else {
      this.showBalancePlan = false;
    }
  }

  ngOnInit(): void {
    this.updateBalancedPortfolio();
  }

}
