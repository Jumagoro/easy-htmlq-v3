import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement } from '../statement/statement';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {

  constructor(
    private stepService: StepService,
    private storageService: StorageService
  ) {}

  commentsAgree: [Statement, string][] = [];
  commentsDisagree: [Statement, string][] = [];
  
  ngOnInit(): void {

    // When /step-4 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(4);

    // Load step4-Storage and quit when successfull
    if(this.checkStep4Storage())
      return;

    // Load step3-storage if no step4-storage is found
    this.checkStep3Storage();
  }


  checkStep4Storage(): boolean {
    // Check if something is stored in the storage from step3
    let currentStorage = this.storageService.get('step4');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage) {
      this.commentsAgree = currentStorage.agree;
      this.commentsDisagree = currentStorage.disagree;
    }

    return true;
  }


  checkStep3Storage(): boolean {
    // Check if something is stored in the storage from step2
    let currentStorage = this.storageService.get('step3');
    if(!currentStorage)
      return false;

    // Load the first and last column if not empty
    if(currentStorage.cols) {

      // Load statements from total disagree
      let firstCol = currentStorage.cols[0];
      for(let cell of firstCol) {

        if(cell && cell.length > 0) {  // Dont push empty col 
          cell[0].color="#ffffff";
          this.commentsDisagree.push([cell[0], ""]);
        }
        
          
      }

      // Load statements from total agree
      let lastCol = currentStorage.cols[currentStorage.cols.length-1];
      for(let cell of lastCol) {

        if(cell && cell.length > 0) {  // Dont push empty col
          cell[0].color="#ffffff";
          this.commentsAgree.push([cell[0], ""]);
        }
        
      }
    }

    return true;
  }

  onContinue() {
    // Load current storage to append the changed array
    let currentStorage = this.storageService.get('step4');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.agree = this.commentsAgree;
    currentStorage.disagree = this.commentsDisagree;

    // Write the storage object into the storage
    this.storageService.set('step4', currentStorage);

    this.stepService.nextStep();
  }

}
