import { Injectable } from '@angular/core';
import { GlobalVars } from '../_config/global';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor() { }

  // Gets the data / conf from the input
  private getInput() {

    let dataInput = document.getElementById('ehq3_data');
    let confInput = document.getElementById('ehq3_conf');

    if(!dataInput) {
      console.log('Missing data!');
    } else {
      let data = dataInput.getAttribute("value");
      if(data)
        GlobalVars.DATA = JSON.parse(data);
      else
        console.log('Missing data!');
    }

    if(!confInput) {
      console.log('Missing conf!');
    } else {
      let conf = confInput.getAttribute("value");
      if(conf)
        GlobalVars.CONF = JSON.parse(conf);
      else
        console.log('Missing conf!');
    }
  }


  onViewReady() {
    let sosci = document.getElementById('sosci-wrapper');
    sosci?.addEventListener('ehq3_input_set', this.getInput.bind(this));
    sosci?.dispatchEvent(new Event('ehq3_init'));
  }

  onComplete() {
    let sosci = document.getElementById('sosci-wrapper');
    sosci?.dispatchEvent(new Event('ehq3_onComplete'));
  }
}
