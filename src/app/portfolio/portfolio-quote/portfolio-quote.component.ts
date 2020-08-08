import {Component, Input} from '@angular/core';
import {Quote} from '../../models/quote';
import {Observable} from 'rxjs';
import {tz} from 'moment-timezone';

@Component({
  selector: 'portfolio-quote',
  templateUrl: './portfolio-quote.component.html',
  styleUrls: ['./portfolio-quote.component.css']
})
export class PortfolioQuoteComponent {

  @Input()
  public quote$: Observable<Quote>;

  nycTz = tz('America/New_York').isDST() ? 'EDT' : 'EST';

}
