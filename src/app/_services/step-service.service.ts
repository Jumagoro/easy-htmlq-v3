import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  
  public getCurrentStep(): number {
    return StepService.currentStep;
  }

  public setCurrentStep(step: number): void {
    StepService.currentStep = step;
    this.storage.set('currentStep', StepService.currentStep); // Store currentStep in the browser storage
  }

  // Increments the step counter by one and routes to the next component
  public nextStep(): void {

    this.setCurrentStep(this.getCurrentStep() + 1);

    if(this.getCurrentStep() == -1)
      this.router.navigate(['/home']);

    else if(this.getCurrentStep() == 0)
      this.router.navigate(['/introduction']);
    
    else if(this.getCurrentStep() == 1)
      this.router.navigate(['/step-1']);

    else if(this.getCurrentStep() == 2)
      this.router.navigate(['/step-2']);

    else if(this.getCurrentStep() == 3)
      this.router.navigate(['/step-3']);

    else if(this.getCurrentStep() == 4)
      this.router.navigate(['/step-4']);

    else if(this.getCurrentStep() == 5)
      this.router.navigate(['/step-5']);

    else if(this.getCurrentStep() == 6)
      this.router.navigate(['/submit']);
    
  }

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }
}
