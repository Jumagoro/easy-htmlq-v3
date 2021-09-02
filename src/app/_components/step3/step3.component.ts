import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  constructor(
    private stepService: StepService
  ) {}

  // When /step-3 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(3);
  }

}
