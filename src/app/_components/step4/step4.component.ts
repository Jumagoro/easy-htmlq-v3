import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {

  constructor(
    private stepService: StepService
  ) {}

  // When /step-4 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(4);
  }

}
