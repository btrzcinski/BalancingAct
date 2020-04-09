import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Quote, QuoteModel} from '../models/quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private serviceUrl = 'http://server.lan:8080/quote';
  private cache = new Map<string, BehaviorSubject<Quote>>();

  constructor(private http: HttpClient) {
  }

  private supplyNextValue(symbol: string) {
    if (symbol === 'CASH') {
      return;
    }

    const subject = this.cache.get(symbol);
    if (!environment.production) {
      console.log(`QuoteService: Not running in production, using fake prices for '${symbol}'`);
      switch (symbol.toUpperCase()) {
        case 'BND':
          subject.next(new QuoteModel('BND', 85.96));
          break;
        case 'BNDX':
          subject.next(new QuoteModel('BNDX', 56.15));
          break;
        case 'VTI':
          subject.next(new QuoteModel('VTI', 123.38));
          break;
        case 'VXUS':
          subject.next(new QuoteModel('VXUS', 40.43));
          break;
        default:
          console.warn('Unknown test security used in development, price not set');
      }
    } else {
      const quoteUrl = `${this.serviceUrl}/${symbol}`;
      this.http.get<Quote>(quoteUrl, {responseType: 'json'})
        .subscribe(quote => subject.next(quote));
    }
  }

  public getQuote(symbol: string): BehaviorSubject<Quote> {
    if (!symbol || symbol.length === 0) {
      return null;
    }
    const normalSymbol = symbol.toUpperCase();

    if (!this.cache.has(normalSymbol)) {
      this.cache.set(normalSymbol, new BehaviorSubject<Quote>(new QuoteModel(normalSymbol, 1)));
    }

    this.supplyNextValue(normalSymbol);
    return this.cache.get(normalSymbol);
  }
}
