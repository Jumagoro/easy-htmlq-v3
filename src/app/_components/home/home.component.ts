import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  startModal: Modal = {
    //messageHead: 'Welcome!',
    message: `
      This is a demo project on iPad use in the classroom.<br>
      <br>
      <b>** Important Information **</b><br>
      For this survey you will need as much screen space as possible!<br>
      <br>
      If necessary, please <b>MAXIMIZE</b> the size of your browser window, reload this web page, and click on the "Continue" button to start the survey.
    `,
    okButton: 'Continue...'
  }

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    this.stepService.setCurrentStep(-1);
  }

}
