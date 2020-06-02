import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, interval, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {Quote, QuoteModel} from '../models/quote';
import {first, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private serviceUrl = '/api/quote';
  private cache = new Map<string, BehaviorSubject<Quote>>();

  constructor(private http: HttpClient) {
  }

  private getNextQuote(symbol: string): Observable<Quote> {
    if (symbol === 'CASH') {
      return;
    }

    if (!environment.production) {
      console.log(`QuoteService: Not running in production, using fake prices for '${symbol}'`);
      switch (symbol.toUpperCase()) {
        case 'BND':
          return of(new QuoteModel('BND', 85.96));
        case 'BNDX':
          return of(new QuoteModel('BNDX', 56.15));
        case 'VTI':
          return of(new QuoteModel('VTI', 123.38));
        case 'VXUS':
          return of(new QuoteModel('VXUS', 40.43));
        default:
          console.warn('Unknown test security used in development, price not set');
      }
    }

    const quoteUrl = `${this.serviceUrl}/${symbol}`;
    return this.http.get<Quote>(quoteUrl, {responseType: 'json'}).pipe(first());
  }

  private supplyNextValue(symbol: string) {
    if (symbol === 'CASH') {
      return;
    }

    const subject = this.cache.get(symbol);
    const nextQuote = this.getNextQuote(symbol);
    // nextQuote.subscribe(subject);
    nextQuote.subscribe(q => subject.next(q));
  }

  private setupRefreshInterval(symbol: string): void {
    const subject = this.cache.get(symbol);
    const refreshInterval = interval(60 * 1000)
      .pipe(switchMap(_ => this.getNextQuote(symbol)));
    // refreshInterval.subscribe(subject);
    refreshInterval.subscribe(q => subject.next(q));
  }

  public getQuote(symbol: string): BehaviorSubject<Quote> {
    if (!symbol || symbol.length === 0) {
      return null;
    }
    const normalSymbol = symbol.toUpperCase();

    if (!this.cache.has(normalSymbol)) {
      this.cache.set(normalSymbol, new BehaviorSubject<Quote>(new QuoteModel(normalSymbol, 1)));
      this.supplyNextValue(normalSymbol);
      this.setupRefreshInterval(normalSymbol);
    }

    return this.cache.get(normalSymbol);
  }
}
