import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal-service.service';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  messageHead: string = 'Welcome!';
  message: string = `
    This is a demo project on iPad use in the classroom.

    ** Important Information **
    For this survey you will need as much screen space as possible!
    
    If necessary, please MAXIMIZE the size of your browser window, reload this web page, and click on the "Continue" button to start the survey.
  `;
  okButton: string = 'Continue...';

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
