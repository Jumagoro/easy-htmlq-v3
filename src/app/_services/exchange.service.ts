import { Injectable } from '@angular/core';
import { GlobalVars } from '../_config/global';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor() { }

  // Gets the data / conf from the input
  private getInput() {
    console.log('read input');
    let dataInput = document.getElementById('ehq3_data');
    let confInput = document.getElementById('ehq3_conf');

    if(!dataInput) {
      console.log('Missing data input!');
    } else {
      let data = dataInput.getAttribute("value");
      if(data)
        GlobalVars.DATA.next(JSON.parse(data));
      else
        console.log('Missing data!');
    }

    if(!confInput) {
      console.log('Missing conf input!');
    } else {
      let conf = confInput.getAttribute("value");
      if(conf)
        GlobalVars.CONF.next(JSON.parse(conf));
      else
        console.log('Missing conf!');
    }
  }


  onViewReady() {
    let sosci = document.getElementById('sosci-wrapper');
    sosci?.addEventListener('ehq3_input_set', this.getInput.bind(this));
    sosci?.dispatchEvent(new Event('ehq3_init'));
  }

  // Notify sosci that the interview is complete
  onComplete() {

    let sosci = document.getElementById('sosci-wrapper');
    sosci?.dispatchEvent(new Event('ehq3_onComplete'));
  }

  // Updates the input value given by sosci
  updateDataInput() {
    let dataInput = document.getElementById('ehq3_data');

    if(!dataInput) {
      console.log('Missing data input!');
    } else {
      dataInput.setAttribute("value", JSON.stringify(GlobalVars.DATA.getValue()));
    }
  }


  /** Data storage operations */
  get(key: string): any {
    let data = GlobalVars.DATA.getValue();
    if(data[key]) {
      return data[key];
    }
    return null;
  }

  set(key: string, value: any): void {
    let data = GlobalVars.DATA.getValue();
    data[key] = value;

    this.updateDataInput();
  }

  remove(key: string): boolean {
    let data = GlobalVars.DATA.getValue();
    if(data[key]) {
      delete data[key];
      this.updateDataInput();
      return true
    }
    return false;
  }
}
