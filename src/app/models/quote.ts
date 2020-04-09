export interface Quote {
  symbol: string;
  price: number;
  lastUpdated: string;
}

export class QuoteModel implements Quote {
  constructor(
    public symbol: string,
    public price: number
  ) {
    this.lastUpdated = new Date().toISOString();
  }

  public lastUpdated: string;
}

