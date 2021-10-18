import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss']
})
export class Step5Component implements OnInit {

  // Form stuff
  form!: FormGroup;

  constructor(
    private stepService: StepService
  ) {}

  // When /step-5 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(5);
  }

  onSubmit() {
    
  }

}
