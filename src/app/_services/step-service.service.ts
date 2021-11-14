import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVars } from '../_config/global';
import { ExchangeService } from './exchange.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  /*  Indicates the current step in the survey
      -1  = Home / No progress
      0   = Introduction screen
      1   = Step 1
      2   = Step 2
      3   = Step 3
      4   = Step 4
      5   = Step 5
  */
  private static currentStep: number = -1;

  private static stepMax: number = 5; // Last step
  
  public getCurrentStep(): number {
    return StepService.currentStep;
  }

  public setCurrentStep(step: number): void {
    StepService.currentStep = Math.min(step, StepService.stepMax);
    this.setStepInData(this.getCurrentStep());
  }

  // Increments the step counter by one and routes to the next component
  public nextStep(): void {

    // Sets the current step
    this.setCurrentStep(this.getCurrentStep() + 1);

    this.navigateToCurrentStep();
      
  }

  // Navigates based on the current step
  public navigateToCurrentStep() {

    if(this.getCurrentStep() == -1) {
      this.router.navigate(['/home']);
    }
      
    else if(this.getCurrentStep() == 0) {
      this.router.navigate(['/step-1']);
    }
    
    else if(this.getCurrentStep() == 1) {
      this.router.navigate(['/step-1']);
    }
      
    else if(this.getCurrentStep() == 2) {
      this.router.navigate(['/step-2']);
    }

    else if(this.getCurrentStep() == 3) {
      if(GlobalVars.CONF.getValue().structure.disableStep3 === true)
        this.nextStep();
      else {
        this.router.navigate(['/step-3']);
      }
    }
      
    else if(this.getCurrentStep() == 4) {
      if(GlobalVars.CONF.getValue().structure.disableStep4 === true)
        this.nextStep();
      else {
        this.router.navigate(['/step-4']);
      }
        
    }

    else if(this.getCurrentStep() == 5) {
      this.exchangeService.onComplete();
    }
  }

  constructor(
    private router: Router,
    private storage: StorageService,
    private exchangeService: ExchangeService
  ) { }

  public setStepInData(step: number) {
  
    // STORE PROGRESS IN
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('progress');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.currentStep = step;

    // Write the storage object into the storage
    this.exchangeService.set('progress', currentStorage);
  }
}
