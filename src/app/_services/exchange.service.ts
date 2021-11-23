import { Injectable } from '@angular/core';
import { GlobalVars } from '../_config/global';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(  ) { }

  // Gets the data / conf from the input
  private getInput() {

    let dataInput = document.getElementById('ehq3_data');
    let confInput = document.getElementById('ehq3_conf');

    // IMPORTANT: Config has to be loaded first
    if(!confInput) {
      console.log('Missing conf input!');
    } else {
      let conf = confInput.getAttribute("value");
      if(conf) {
        GlobalVars.CONF.next(JSON.parse(conf));
      }
        
      else
        console.log('Missing conf!');
    }


    if(!dataInput) {
      console.log('Missing data input!');
    } else {

      let data = dataInput.getAttribute("value");

      if(data) {
        try { // Set data if input is valid json
          GlobalVars.DATA.next(JSON.parse(data));
        } catch (e) { // Set empty if not in json format
          GlobalVars.DATA.next({});
        }
      }   
      else  // Set empty if no data is given
        GlobalVars.DATA.next({}); 
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
    sosci?.dispatchEvent(new Event('ehq3_complete'));
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


  /**
   * Notifies sosci, that the user has interacted with an instruction (help button, okay, etc.)
   * @param step The current step the user is in
   * @param phase The exact event that happened (help, instruction, start)
   */
  dispatchSosciPresent(step: number, phase: string) {

    document.getElementById('sosci-wrapper')?.dispatchEvent(new CustomEvent('ehq3_present', {
      'detail': {
        step: step,
        phase: phase
      }
    }));

  }


  /**
   * Loads the statement's content with the given id from the config
   * @param id  ID of the statement to get the content from
   * @returns The content of the statement with the given id
   */
  public getStatementByID(id: number): string {
    if(!GlobalVars.CONF || !GlobalVars.CONF.getValue())
      return "";

    for(let statement of GlobalVars.CONF.getValue().statements) {
      if(statement.id == id)
        return statement.statement;
    }

    return "";
  }
}
