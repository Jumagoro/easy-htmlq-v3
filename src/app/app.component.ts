import { Component } from '@angular/core';
import { GlobalVars } from './_config/global';
import { ExchangeService } from './_services/exchange.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'easy-htmlq-v3';

  constructor(
    private exchange: ExchangeService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit')
    this.exchange.onViewReady();
  }

  
}
