import {Component, Input, OnInit} from '@angular/core';
import {Quote} from '../../models/quote';

@Component({
  selector: 'portfolio-quote',
  templateUrl: './portfolio-quote.component.html',
  styleUrls: ['./portfolio-quote.component.css']
})
export class PortfolioQuoteComponent implements OnInit {

  @Input()
  public quote: Quote;

  constructor() {
  }

  ngOnInit(): void {
  }

}
