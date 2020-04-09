import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {Quote, QuoteModel} from '../models/quote';

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
      return of(new QuoteModel('CASH', 1));
    }

    // In development mode, return fixed prices for known test securities to avoid hitting the API so much.
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
          console.warn('Unknown test security used in development, will hit the API anyway');
      }
    }

    const quoteUrl = `${this.serviceUrl}/${symbol}`;
    return this.http.get<Quote>(quoteUrl, {responseType: 'json'});
  }
}
