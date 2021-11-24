import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { ModalService } from 'src/app/_services/modal-service.service';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from './modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {

  @Input() modal!: Modal; // decorate the property with @Input()

  constructor(
    private stepService: StepService,
    private modalService: ModalService,
    private exchangeService: ExchangeService
  ) { }

  ngOnInit(): void {
    if(!this.modal || !this.modal.message) {
      this.ok();
    } else {
      this.modalService.setVisible(true);
    }
    
  }

  ok(): void {

    if(this.stepService.getFurthestStep() < 1) { // On step == -1 and 0 the navigator should lead to the next step
      this.stepService.nextStep();
    }
    
    else {
      this.exchangeService.dispatchSosciPresent(this.stepService.getCurrentStep, "start");
      this.modalService.setVisible(false);
    }
    
  }

  isVisible() {
    return this.modalService.getVisible();
  }

  getButtonText() {
    if(this.modal.okButton && this.modal.okButton !== '')
      return this.modal.okButton;
    else
      return "Continue";
  }

}
