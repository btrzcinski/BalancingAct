import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PortfolioComponent} from './portfolio.component';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {PortfolioQuoteComponent} from './portfolio-quote/portfolio-quote.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioQuoteComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    PortfolioComponent
  ]
})
export class PortfolioModule { }
