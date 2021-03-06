import {Quote} from './quote';
import {BehaviorSubject} from 'rxjs';

export interface Holding {
  symbol: string;
  targetAllocation: number;
  sellToBalance: boolean;
  quantity: number;
}

export class HoldingModel implements Holding {
  constructor(
    private portfolio: HoldingModel[],
    public symbol: string,
    public targetAllocation: number,
    public sellToBalance: boolean,
    public quantity: number,
    public quote$: BehaviorSubject<Quote>
  ) {
  }

  get amount(): number {
    return this.quantity * this.price;
  }

  get currentAllocation(): number {
    return this.amount / this.getPortfolioTotal();
  }

  get distanceToTargetAllocation(): number {
    return this.currentAllocation - this.targetAllocation;
  }

  get price(): number {
    return this.quote$.getValue().price;
  }

  get isBalanced(): boolean {
    const proposedHoldingQuantity = this.quantity + (this.distanceToTargetAllocation < 0 ? 1 : -1);
    const currentAbsDistance = Math.abs(this.distanceToTargetAllocation);
    const proposedAbsDistance = Math.abs(
      ((this.price * proposedHoldingQuantity) / this.getPortfolioTotal()) - this.targetAllocation);
    return proposedAbsDistance >= currentAbsDistance;
  }

  get isCash(): boolean {
    return this.symbol.toUpperCase() === 'CASH';
  }

  static createCopyFromModel(portfolio: HoldingModel[], holdingModel: HoldingModel,
                             quote$?: BehaviorSubject<Quote>) {
    return new HoldingModel(
      portfolio,
      holdingModel.symbol,
      holdingModel.targetAllocation,
      holdingModel.sellToBalance,
      holdingModel.quantity,
      quote$ ? quote$ : holdingModel.quote$
    );
  }

  private getPortfolioTotal(): number {
    return this.portfolio.map(h => h.amount).reduce((p, v) => p + v, 0);
  }
}
