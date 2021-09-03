import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    this.stepService.setCurrentStep(-1);
  }

}
