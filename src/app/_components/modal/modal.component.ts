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


  constructor(
    private stepService: StepService,
    private modalService: ModalService,
    private exchangeService: ExchangeService
  ) { }


  // Data of the modal
  @Input() modal!: Modal; // decorate the property with @Input()


  ngOnInit(): void {
    if(!this.modal || !this.modal.message) {
      this.ok();
    } else {
      this.modalService.setVisible(true);
    }
  }


  /**
   * Leads to next step or starts the module, depending on the current step,
   * when the user clicks continue on the modal
   */
  ok(): void {

     // On step == -1 and 0 the navigator should lead to the next step
    if(this.stepService.getCurrentStep < 1) {
      this.stepService.nextStep();
    }
    
    // Notify sosci about the start of the module
    else {
      this.exchangeService.dispatchSosciPresent(this.stepService.getCurrentStep, "start");
      this.modalService.setVisible(false);
    }
    
  }


  /**
   * Returns, if the modal is currently visible
   * @returns True, if the modal is currently visible
   */
  isVisible() {
    return this.modalService.getVisible();
  }


  // Getter / Setter

  getButtonText() {
    if(this.modal.okButton && this.modal.okButton !== '')
      return this.modal.okButton;
    else
      return "Continue";
  }

}
