import { Injectable } from '@angular/core';
import { ExchangeService } from './exchange.service';
import { StepService } from './step-service.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private exchangeService: ExchangeService,
    private stepService: StepService
  ) { }

  private static modalVisible: boolean = true;
  private static isHelp: boolean = false;

  public getVisible(): boolean {
    return ModalService.modalVisible;
  }

  public setVisible(visible: boolean): void {
    if(visible == true && ModalService.isHelp == false)
      this.exchangeService.dispatchSosciPresent(this.stepService.getCurrentStep, "instruction");

    ModalService.modalVisible = visible;
    this.setIsHelp(false);
  }

  public setIsHelp(isHelp: boolean): void {
    ModalService.isHelp = isHelp;
  }
}
