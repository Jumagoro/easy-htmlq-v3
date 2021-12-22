import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../_components/footer/footer.component';
import { GlobalVars } from '../_config/global';
import { ExchangeService } from './exchange.service';

@Injectable({
  providedIn: 'root'
})
export class StepService {


  constructor(
    private router: Router,
    private exchangeService: ExchangeService
  ) { }


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


  /**
   * Updates the furthest step, if new step is higher than current one
   * Jumps to next available step, if given step is highest and disabled
   * Writes furthest step into the data
   * @param step Step to set if highest one yet
   */
  public setFurthestStep(step: number): void {

    // Check if step is new furthest step
    StepService.furthestStep = Math.min(Math.max(step, StepService.furthestStep), StepService.stepMax);

    // Jump to next step if step is disabled
    if(this.isStepDisabled(this.getFurthestStep)) {
      this.setFurthestStep(this.getFurthestStep+1);
      this.navigateToFurthestStep();
    } 
    
    // Write to data if not disabled
    else {
      this.setStepInData(this.getFurthestStep);
    }
    
  }


  /**
   * Increments the step counter by one and routes to the next component
   * Synchronizes furthest step and url, if not synchronized
   */
  public nextStep(): void {

    // Jump to current page if not in sync and furthest step not disabled
    if( !this.isStepAndURLSync() && !this.isStepDisabled(this.getFurthestStep) )   // Otherwise infinite recursion
    {
      this.navigateToFurthestStep();
      return;
    }

    // Jump to next page if highest step = current step
    this.setFurthestStep(this.getFurthestStep + 1);

    this.navigateToFurthestStep();
      
  }


  /**
   * Jumps to furthest step, if not disabled
   * Jumps to the next available step, if furthest step is disabled
   */
  public navigateToFurthestStep() {

    if(this.getFurthestStep == -1) {
      this.router.navigate(['/home']);
    }
    
    else if(this.getFurthestStep == 0) {
      if(this.isStepDisabled(0))
        this.nextStep();
      else {
        this.router.navigate(['/step-1']);
      }
    }

    else if(this.getFurthestStep == 1) {
      if(this.isStepDisabled(1))
        this.nextStep();
      else {
        this.router.navigate(['/step-1']);
      }
    }
      
    else if(this.getFurthestStep == 2) {
      this.router.navigate(['/step-2']);
    }

    else if(this.getFurthestStep == 3) {
      if(this.isStepDisabled(3))
        this.nextStep();
      else {
        this.router.navigate(['/step-3']);
      }
    }
      
    else if(this.getFurthestStep == 4) {
      if(this.isStepDisabled(4))
        this.nextStep();
      else {
        this.router.navigate(['/step-4']);
      }
        
    }

    else if(this.getFurthestStep == 5) {
      if( (this.getStep4Forced() && this.exchangeService.getStep4Complete()) || !this.getStep4Forced())
        this.exchangeService.onComplete();

      // Alert, if step4 is required and not finished yet
      else {
        alert(this.getContinue4DisabledAlert());
        this.setFurthestStep(4);
        FooterComponent.setContinueEnabled(true);
      }
    }
  }


  /**
   * Writes the given step into the data
   * @param step  Step to write into the data
   */
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

  
  /**
   * Checks if the current route (step) matches the furthest step
   * @returns Returns true if the current route (step) is the furthest step
   */
  private isStepAndURLSync(): boolean {

    if(this.getCurrentStep == this.getFurthestStep)
        return true;

    return false;
  }


  /**
   * Gets the current step based on the route
   * @returns Returns the number referring to the current step
   */
  public get getCurrentStep(): number {

    if(this.router.url === '/home')
      return -1;

    else if(this.router.url === '/step-1' && this.getFurthestStep <= 0)
      return 0;

    else if(this.router.url === '/step-1' && this.getFurthestStep > 0)
      return 1;

    else  if(this.router.url === '/step-2')
      return 2;

    else  if(this.router.url === '/step-3')
      return 3;

    else  if(this.router.url === '/step-4')
      return 4;

    return -2;
    
  }

  // Getter / Setter
  getStep4Forced() {
    if(GlobalVars.CONF.getValue().structure && GlobalVars.CONF.getValue().structure.forceStep4)
      return GlobalVars.CONF.getValue().structure.forceStep4;

    return false;
  }

  
  getContinue4DisabledAlert() {
    if(GlobalVars.CONF.getValue().instructions && GlobalVars.CONF.getValue().instructions.step4UnfinishedText)
      return GlobalVars.CONF.getValue().instructions.step4UnfinishedText;
    else
      return 'Please fill all fields.'
  }


  public isStepDisabled(step: number): boolean {
    return ((step == 0 || step == 1) && GlobalVars.CONF.getValue().structure.disableStep1) ||
            (step == 3 && GlobalVars.CONF.getValue().structure.disableStep3) ||
            (step == 4 && GlobalVars.CONF.getValue().structure.disableStep4);
  }


  public get getFurthestStep(): number {
    return StepService.furthestStep;
  }
}
