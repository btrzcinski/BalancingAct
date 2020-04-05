import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  serviceUrl = 'https://www.alphavantage.co/query';
  apiKey = '6V8W1GM8HTUJ8FK3';

  constructor(private http: HttpClient) { }

  public getQuote(symbol: string): Observable<number> {
    if (!symbol || symbol.length === 0) {
      return of(0);
    }

    if (symbol.toUpperCase() === 'CASH') {
      return of(1);
    }

    // In development mode, return fixed prices for known test securities to avoid hitting the API so much.
    if (!environment.production) {
      console.log(`QuoteService: Not running in production, using fake prices for '${symbol}'`);
      switch (symbol.toUpperCase()) {
        case 'BND': return of(85.96);
        case 'BNDX': return of(56.15);
        case 'VTI': return of(123.38);
        case 'VXUS': return of(40.43);
        default: console.warn('Unknown test security used in development, will hit the API anyway');
      }
    }

    const params = new HttpParams({fromObject: {
        apikey: this.apiKey,
        symbol,
        function: 'GLOBAL_QUOTE'
      }});
    return this.http.get(this.serviceUrl, {responseType: 'json', params})
      .pipe(map(obj => parseFloat(obj['Global Quote']['05. price'])));
  }
}
