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
      0   = Step 1 Introduction screen
      1   = Step 1
      2   = Step 2
      3   = Step 3
      4   = Step 4
      5   = Step 5
  */
  private static furthestStep: number = -1;

  private static stepMax: number = 5; // Last step
  
  public getFurthestStep(): number {
    return StepService.furthestStep;
  }

  public setFurthestStep(step: number): void {
    StepService.furthestStep = Math.min(Math.max(step, StepService.furthestStep), StepService.stepMax);
    this.setStepInData(this.getFurthestStep());
  }

  // Increments the step counter by one and routes to the next component
  public nextStep(): void {

    // Jump to current page if not in sync and furthest step not disabled
    if(!this.isStepAndURLSync() && 
       !(this.getFurthestStep() == 3 && GlobalVars.CONF.getValue().structure.disableStep3) && // Don't jump if target jump is disabled
       !(this.getFurthestStep() == 4 && GlobalVars.CONF.getValue().structure.disableStep4)    // Otherwise infinite recursion
    ) {
      this.navigateToFurthestStep();
      return;
    }

    // Sets the current step
    this.setFurthestStep(this.getFurthestStep() + 1);

    this.navigateToFurthestStep();
      
  }

  // Navigates based on the current step
  public navigateToFurthestStep() {

    if(this.getFurthestStep() == -1) {
      this.router.navigate(['/home']);
    }
    
    else if(this.getFurthestStep() == 0) {
      this.router.navigate(['/step-1']);
    }

    else if(this.getFurthestStep() == 1) {
      this.router.navigate(['/step-1']);
    }
      
    else if(this.getFurthestStep() == 2) {
      this.router.navigate(['/step-2']);
    }

    else if(this.getFurthestStep() == 3) {
      if(GlobalVars.CONF.getValue().structure.disableStep3 === true)
        this.nextStep();
      else {
        this.router.navigate(['/step-3']);
      }
    }
      
    else if(this.getFurthestStep() == 4) {
      if(GlobalVars.CONF.getValue().structure.disableStep4 === true)
        this.nextStep();
      else {
        this.router.navigate(['/step-4']);
      }
        
    }

    else if(this.getFurthestStep() == 5) {
      this.exchangeService.onComplete();
    }
  }

  constructor(
    private router: Router,
    private storage: StorageService,
    private exchangeService: ExchangeService
  ) { }

  private setStepInData(step: number) {
  
    // STORE PROGRESS IN
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('progress');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.furthestStep = step;

    // Write the storage object into the storage
    this.exchangeService.set('progress', currentStorage);
  }

  // Checks if the browser path and furthestStep are in sync
  private isStepAndURLSync(): boolean {

    if(this.getCurrentStep == this.getFurthestStep())
        return true;

    return false;

  }


  /**
   * Gets the current step based on the route
   */
  public get getCurrentStep(): number {

    if(this.router.url === '/home')
      return -1;

    else if(this.router.url === '/step-1' && this.getFurthestStep() <= 0)
      return 0;

    else if(this.router.url === '/step-1' && this.getFurthestStep() > 0)
      return 1;

    else  if(this.router.url === '/step-2')
      return 2;

    else  if(this.router.url === '/step-3')
      return 3;

    else  if(this.router.url === '/step-4')
      return 4;

    return -2;
    
  }
}
