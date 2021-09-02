import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    private stepService: StepService
  ) {}

  // When /step-2 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(2);
  }

}
