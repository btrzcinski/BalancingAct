import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PortfolioModule } from './portfolio/portfolio.module';
import {BalancerModule} from './balancer/balancer.module';
import {RouterModule} from '@angular/router';
import { BalancingActComponent } from './balancing-act/balancing-act.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


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
          path: 'balancingAct',
          component: BalancingActComponent
        },
        {
          path: '',
          redirectTo: '/balancingAct',
          pathMatch: 'full'
        },
        {
          path: '**',
          component: PageNotFoundComponent
        }
      ]
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
