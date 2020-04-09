import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {Quote} from '../models/quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  serviceUrl = 'http://server.lan:8080/quote';

  constructor(private http: HttpClient) { }

  public getQuote(symbol: string): Observable<Quote> {
    if (!symbol || symbol.length === 0) {
      return null;
    }

    if (symbol.toUpperCase() === 'CASH') {
      return of<Quote>({symbol: 'CASH',
      price: 1,
      lastUpdated: 'Now'});
    }

    // In development mode, return fixed prices for known test securities to avoid hitting the API so much.
    if (!environment.production) {
      console.log(`QuoteService: Not running in production, using fake prices for '${symbol}'`);
      switch (symbol.toUpperCase()) {
        case 'BND':
          return of<Quote>({symbol: 'BND', price: 85.96, lastUpdated: 'DevMode'});
        case 'BNDX':
          return of<Quote>({symbol: 'BNDX', price: 56.15, lastUpdated: 'DevMode'});
        case 'VTI':
          return of<Quote>({symbol: 'VTI', price: 123.38, lastUpdated: 'DevMode'});
        case 'VXUS':
          return of<Quote>({symbol: 'VXUS', price: 40.43, lastUpdated: 'DevMode'});
        default:
          console.warn('Unknown test security used in development, will hit the API anyway');
      }
    }

    const quoteUrl = `${this.serviceUrl}/${symbol}`;
    return this.http.get<Quote>(quoteUrl, {responseType: 'json'});
  }
}
