import {Injectable} from '@angular/core';
import {Holding, HoldingModel} from '../models/holding';
import {QuoteService} from './quote.service';

@Injectable({
  providedIn: 'root'
})
export class SerializerService {

  constructor(private quoteService: QuoteService) {
  }

  private stripPortfolio(portfolio: HoldingModel[]): Holding[] {
    return portfolio.map(hm => {
      return {
        symbol: hm.symbol,
        targetAllocation: hm.targetAllocation,
        sellToBalance: hm.sellToBalance,
        quantity: hm.quantity,
      } as Holding;
    });
  }

  private createPortfolio(holdings: Holding[]): HoldingModel[] {
    const portfolio = new Array<HoldingModel>();
    holdings.forEach(h => portfolio.push(new HoldingModel(
      portfolio,
      h.symbol,
      h.targetAllocation,
      h.sellToBalance,
      h.quantity,
      this.quoteService.getQuote(h.symbol),
    )));
    return portfolio;
  }

  public serializeHoldings(holdings: HoldingModel[]): string {
    return encodeURIComponent(btoa(JSON.stringify(this.stripPortfolio(holdings))));
  }

  public deserializeHoldings(holdings: string): HoldingModel[] {
    return this.createPortfolio(JSON.parse(atob(decodeURIComponent(holdings))));
  }
}
