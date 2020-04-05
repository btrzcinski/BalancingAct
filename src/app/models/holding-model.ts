export class HoldingModel {
  constructor(
    private portfolio: HoldingModel[],
    public symbol: string,
    public targetAllocation: number,
    public sellToBalance: boolean,
    public quantity: number,
    public price: number
  ) {}

  get amount(): number {
    return this.quantity * this.price;
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
      ((this.price * proposedHoldingQuantity) / this.getPortfolioTotal()) - this.targetAllocation);
    return proposedAbsDistance >= currentAbsDistance;
  }

  get isCash(): boolean {
    return this.symbol.toUpperCase() === 'CASH';
  }

  private getPortfolioTotal(): number {
    return this.portfolio.map(h => h.amount).reduce((p, v) => p + v, 0);
  }
}
