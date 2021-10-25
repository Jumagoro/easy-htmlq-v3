import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  introductionModal: Modal = {
    //messageHead: 'Welcome!',
    message: undefined,
    okButton: undefined
  }

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    this.stepService.setCurrentStep(0);
  }

}
