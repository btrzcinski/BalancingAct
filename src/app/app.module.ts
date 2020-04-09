import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PortfolioModule} from './portfolio/portfolio.module';
import {BalancerModule} from './balancer/balancer.module';
import {RouterModule} from '@angular/router';
import {BalancingActComponent} from './balancing-act/balancing-act.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {QuoteService} from './portfolio/quote.service';


@NgModule({
  declarations: [
    AppComponent,
    BalancingActComponent,
    PageNotFoundComponent
  ],
  imports: [
    BalancerModule,
    BrowserModule,
    PortfolioModule,
    RouterModule.forRoot(
      [
        {
          path: 'app',
          component: BalancingActComponent
        },
        {
          path: '',
          redirectTo: '/app',
          pathMatch: 'full'
        },
        {
          path: '**',
          component: PageNotFoundComponent
        }
      ]
    )
  ],
  providers: [QuoteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
