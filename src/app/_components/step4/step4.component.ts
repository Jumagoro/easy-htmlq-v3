import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { ProgressService } from 'src/app/_services/progress.service';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement, Type } from '../statement/statement';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {

  constructor(
    private stepService: StepService,
    private storageService: StorageService,
    private exchangeService: ExchangeService,
    private progressService: ProgressService
  ) {}

  commentsAgree: [Statement, string][] = [];
  commentsDisagree: [Statement, string][] = [];

  totalComments = 0;
  
  ngOnInit(): void {

    // When /step-4 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(4);

    // Load data if ready
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
        // Load step4-Storage and quit when successfull
        if(this.checkStage3Storage())
          return;

        // Load step3-storage if no step4-storage is found
        this.checkStage2Storage();
      }
    );
    
  }


  checkStage3Storage(): boolean {
    // Check if something is stored in the storage from step3
    let currentStorage = this.exchangeService.get('stage3');

    if(!currentStorage)
      return false;

    // Load the storage if not empty
    this.commentsAgree = currentStorage.agree;
    this.commentsDisagree = currentStorage.disagree;

    this.totalComments = this.commentsAgree.length + this.commentsDisagree.length;

    return true;
  }


  checkStage2Storage(): boolean {
    // Check if something is stored in the storage from stage2
    let currentStorage = this.exchangeService.get('stage2');

    if(!currentStorage)
      return false;

    // Load the first and last column if not empty
    if(currentStorage.cols) {

      // Load statements from total disagree
      let firstCol = currentStorage.cols[0];
      for(let cell of firstCol) {

        if(cell && cell.length > 0) {  // Dont push empty col 
          this.commentsDisagree.push([cell[0], ""]);
        }
      }

      // Load statements from total agree
      let lastCol = currentStorage.cols[currentStorage.cols.length-1];
      for(let cell of lastCol) {

        if(cell && cell.length > 0) {  // Dont push empty col
          this.commentsAgree.push([cell[0], ""]);
        }
        
      }

      this.totalComments = this.commentsAgree.length + this.commentsDisagree.length;
    }

    return true;
  }

  onContinue() {
    this.storeProgress();

    this.stepService.nextStep();
  }


  // Fired when something is typed into a comment
  commentChange(event: any) {
    this.storeProgress();

    this.calculateProgress();
  }

  storeProgress() {
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('stage3');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.agree = this.commentsAgree;
    currentStorage.disagree = this.commentsDisagree;

    // Write the storage object into the storage
    this.exchangeService.set('stage3', currentStorage);
  }

  private calculateProgress() {
    let commentsFilled = 0;
    for(let comment of this.commentsAgree) {
      if(comment[1] && comment[1] !== '')
        commentsFilled++;
    }

    for(let comment of this.commentsDisagree) {
      if(comment[1] && comment[1] !== '')
        commentsFilled++;
    }

    console.log((commentsFilled / this.totalComments) )
    this.progressService.setProgress( (2/3) + (commentsFilled / this.totalComments) * (1/3) );

  }
}
