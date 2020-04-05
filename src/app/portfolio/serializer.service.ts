import { Injectable } from '@angular/core';
import {HoldingModel} from '../models/holding-model';

@Injectable({
  providedIn: 'root'
})
export class SerializerService {

  constructor() { }

  private clonePortfolio(portfolio: HoldingModel[], setPortfolioReference: boolean = true): HoldingModel[] {
    const newPortfolio = new Array<HoldingModel>();
    portfolio.forEach(h => newPortfolio.push(new HoldingModel(
      (setPortfolioReference ? newPortfolio : null),
      h.symbol,
      h.targetAllocation,
      h.sellToBalance,
      h.quantity,
      h.price
    )));
    return newPortfolio;
  }

  public serializeHoldings(holdings: HoldingModel[]): string {
    return encodeURIComponent(btoa(JSON.stringify(this.clonePortfolio(holdings, false))));
  }

  public deserializeHoldings(holdings: string): HoldingModel[] {
    return this.clonePortfolio(JSON.parse(atob(decodeURIComponent(holdings))));
  }
}
