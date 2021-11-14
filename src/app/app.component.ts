import { Component } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from './_config/global';
import { ExchangeService } from './_services/exchange.service';
import { StepService } from './_services/step-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'easy-htmlq-v3';

  constructor(
    private exchangeService: ExchangeService,
    public stepService: StepService
  ) { }

  ngOnInit() {
    
    // Initialise with data 
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {

        if((Object.keys(data).length === 0))
          return;
          
        // Send user to certain step if given in the data
        if(GlobalVars.DATA.getValue().progress && GlobalVars.DATA.getValue().progress.currentStep) {
          
          let currentStep = GlobalVars.DATA.getValue().progress.currentStep;

          this.stepService.setCurrentStep(currentStep);
          this.stepService.navigateToCurrentStep();
        } 
      }
    );

    this.exchangeService.onViewReady();
  }

  
}
