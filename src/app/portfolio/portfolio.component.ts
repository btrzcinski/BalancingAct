import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HoldingModel} from '../models/holding-model';
import {FormControl, FormGroup} from '@angular/forms';
import {QuoteService} from './quote.service';
import {ActivatedRoute, Params} from '@angular/router';
import {SerializerService} from './serializer.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  get holdings(): HoldingModel[] {
    return this._holdings;
  }

  @Input()
  set holdings(value: HoldingModel[]) {
    this._holdings = value;
    this.updatePermalink();
  }

  constructor(private quoteService: QuoteService,
              private serializerService: SerializerService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params =>
      this.updateHoldingsFromQueryParams(params)
    );
  }

  // tslint:disable-next-line:variable-name
  private _holdings: HoldingModel[] = new Array<HoldingModel>();

  @Input()
  public editable: boolean;

  permalink = '/balancingAct';

  newHoldingForm = new FormGroup({
    symbol: new FormControl('', {
      updateOn: 'blur'
    }),
    targetAllocation: new FormControl(''),
    sellToBalance: new FormControl(false),
    quantity: new FormControl(''),
  });

  newHoldingPrice = 0;

  @ViewChild('symbolInput')
  symbolInput: ElementRef;

  @ViewChild('quantityInput')
  quantityInput: ElementRef;

  ngOnInit(): void {
    this.newHoldingForm.get('symbol').valueChanges.subscribe(
      (symbol) => this.updateFormFromSymbol(symbol));
  }

  addHolding(): void {
    this._holdings.push(new HoldingModel(
      this._holdings,
      this.newHoldingForm.get('symbol').value.toUpperCase(),
      +this.newHoldingForm.get('targetAllocation').value * .01,
      this.newHoldingForm.get('sellToBalance').value,
      +this.newHoldingForm.get('quantity').value,
      this.newHoldingPrice,
    ));
    this.updatePermalink();
    this.newHoldingForm.reset();
    this.symbolInput.nativeElement.focus();
  }

  updatePermalink() {
    this.permalink = '/balancingAct?holdings=' + this.serializerService.serializeHoldings(this._holdings);
  }

  removeHolding(holdingIndex: number): void {
    this.newHoldingForm.get('symbol').setValue(this._holdings[holdingIndex].symbol);
    this.newHoldingForm.get('targetAllocation').setValue(
      Math.round(this._holdings[holdingIndex].targetAllocation * 100));
    this.newHoldingForm.get('sellToBalance').setValue(this._holdings[holdingIndex].sellToBalance);
    this.newHoldingForm.get('quantity').setValue(this._holdings[holdingIndex].quantity);
    this._holdings.splice(holdingIndex, 1);
    this.updatePermalink();
    this.symbolInput.nativeElement.focus();
  }

  updateFormFromSymbol(symbol: string): void {
    if (symbol?.toUpperCase() === 'CASH') {
      this.newHoldingForm.get('targetAllocation').setValue(0);
      this.newHoldingForm.get('sellToBalance').setValue(true);
      this.quantityInput.nativeElement.focus();
    }
    this.quoteService.getQuote(symbol).subscribe((quote) => this.newHoldingPrice = quote);
  }

  private updateHoldingsFromQueryParams(params: Params) {
    if (params.holdings) {
      this.holdings = this.serializerService.deserializeHoldings(params.holdings);
      this.updatePrices();
    }
  }

  private updatePrices() {
    this.holdings.forEach(h => this.quoteService.getQuote(h.symbol).subscribe(quote => h.price = quote));
  }
}
