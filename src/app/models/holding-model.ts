import {Quote} from './quote';
import {BehaviorSubject, Observable} from 'rxjs';

export class HoldingModel {
  get quote(): Quote {
    return this._quote;
  }

  set quote(value: Quote) {
    this._quote = value;
    this._quote$.next(value);
  }

  get quote$(): Observable<Quote> {
    return this._quote$;
  }

  constructor(
    private portfolio: HoldingModel[],
    public symbol: string,
    public targetAllocation: number,
    public sellToBalance: boolean,
    public quantity: number,
    quote: Quote,
  ) {
    this._quote = quote;
    this._quote$ = new BehaviorSubject<Quote>(this._quote);
  }

  get amount(): number {
    return this.quantity * this._quote.price;
  }

  get currentAllocation(): number {
    return this.amount / this.getPortfolioTotal();
  }

  get distanceToTargetAllocation(): number {
    return this.currentAllocation - this.targetAllocation;
  }

  get isBalanced(): boolean {
    const proposedHoldingQuantity = this.quantity + (this.distanceToTargetAllocation < 0 ? 1 : -1);
    const currentAbsDistance = Math.abs(this.distanceToTargetAllocation);
    const proposedAbsDistance = Math.abs(
      ((this._quote.price * proposedHoldingQuantity) / this.getPortfolioTotal()) - this.targetAllocation);
    return proposedAbsDistance >= currentAbsDistance;
  }

  get isCash(): boolean {
    return this.symbol.toUpperCase() === 'CASH';
  }

  // tslint:disable-next-line:variable-name
  private _quote: Quote;

  // tslint:disable-next-line:variable-name
  private _quote$: BehaviorSubject<Quote>;

  static createCopyFromModel(portfolio: HoldingModel[], holdingModel: HoldingModel) {
    return new HoldingModel(
      portfolio,
      holdingModel.symbol,
      holdingModel.targetAllocation,
      holdingModel.sellToBalance,
      holdingModel.quantity,
      holdingModel._quote
    );
  }

  private getPortfolioTotal(): number {
    return this.portfolio.map(h => h.amount).reduce((p, v) => p + v, 0);
  }
}
