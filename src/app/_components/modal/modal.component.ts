import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from 'src/app/_services/modal-service.service';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from './modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() modal!: Modal; // decorate the property with @Input()

  constructor(
    private stepService: StepService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalService.setVisible(true);
  }

  ok(): void {
    if(this.stepService.getCurrentStep() < 1) // On step == -1 or step == 0 the navigator should lead to the next page
      this.stepService.nextStep();

    this.modalService.setVisible(false);
  }

  isVisible() {
    return this.modalService.getVisible();
  }

}
