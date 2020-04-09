import {Injectable} from '@angular/core';
import {HoldingModel} from '../models/holding-model';
import {QuoteModel} from '../models/quote';

@Injectable({
  providedIn: 'root'
})
export class BalancerService {

  constructor() { }

  private clonePortfolio(portfolio: HoldingModel[]): HoldingModel[] {
    const newPortfolio = new Array<HoldingModel>();
    portfolio.forEach(
      h => newPortfolio.push(
        HoldingModel.createCopyFromModel(newPortfolio, h)));
    return newPortfolio;
  }

  public createBalancePlan(currentPortfolio: HoldingModel[]): HoldingModel[] {
    const newPortfolio = this.clonePortfolio(currentPortfolio);

    // Find the cash holding, or create one
    let cash = newPortfolio.find(h => h.isCash);
    if (!cash) {
      cash = new HoldingModel(newPortfolio, 'CASH', 0, true, 0,
        new QuoteModel('CASH', 1));
    }

    const shouldSellHoldingToBalance: (h: HoldingModel) => boolean =
        h => h.sellToBalance && !h.isBalanced && h.distanceToTargetAllocation > 0 && !h.isCash;
    // - Sell out-of-balance securities until they are within 1 share of being in balance,
    //   and create a cash pile
    newPortfolio.filter(shouldSellHoldingToBalance)
      .forEach(h => {
        while (!h.isBalanced) {
          h.quantity--;
          cash.quantity += h.quote.price;
        }
      });

    // - Create a priority queue of out-of-balance securities to buy (ordered by % off balance)
    // - Loop:
    //   - Try to buy one share of the most out-of-balance security
    //   - If there isn't enough cash available, drop that security and try the next one
    //   - If no more securities are left, we're done
    const shouldBuyHoldingToBalance: (h: HoldingModel) => boolean =
      h => !h.isCash && h.distanceToTargetAllocation < 0 && h.quote.price <= cash.quantity && !h.isBalanced;
    while (newPortfolio.some(shouldBuyHoldingToBalance)) {
      const holdingToBuy = newPortfolio.filter(shouldBuyHoldingToBalance)
        .sort((a, b) => b.distanceToTargetAllocation - a.distanceToTargetAllocation)
        .pop();
      holdingToBuy.quantity++;
      cash.quantity = +(cash.quantity - holdingToBuy.quote.price).toFixed(2);
    }

    return newPortfolio;
  }
}
