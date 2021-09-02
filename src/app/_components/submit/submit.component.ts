import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor(
    private stepService: StepService
  ) {}

  // When /submit is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(6);
  }
}
