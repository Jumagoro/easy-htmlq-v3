import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { ProgressService } from 'src/app/_services/progress.service';
import { StepService } from 'src/app/_services/step-service.service';
import { FooterComponent } from '../footer/footer.component';
import { Modal } from '../modal/modal';
import { Statement } from '../statement/statement';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step4Component implements OnInit {


  constructor(
    private stepService: StepService,
    private exchangeService: ExchangeService,
    private progressService: ProgressService
  ) {}

  
  /* Modal utility */
  step4Modal!: Modal;
  modalLoaded: boolean = false;

  // Arrays combining a statement with a comment
  commentsAgree: [Statement, string][] = [];
  commentsDisagree: [Statement, string][] = [];

  // Used to calculate the progress
  totalComments = 0;
  

  /**
   * Retrieve information (config & data) used in this module
   */
  ngOnInit(): void {

    // When /step-4 is accessed directly by url the stepService wouldn't know that
    this.stepService.setFurthestStep(4);

    // Load data if ready
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
        // Load stage4-Storage and quit when successfull
        if(this.checkStage4Storage())
          return;

        // Load stage2-storage if no stage4-storage is found
        this.checkStage2Storage();
      }
    );

    // Initialise with config if no data is provided (data may override later) 
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => ((Object.keys(conf).length === 0)), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;

        this.step4Modal = {
          message: conf.instructions.step4Instruction,
          okButton: conf.instructions.step4Button
        }

        // Hide modal until config is loaded (otherwise modal fires next and later loaded modal is skipped)
        this.modalLoaded = true;
      }
    );
    
    FooterComponent.continueEnabled = true;
  }


  /**
   * Check if stage4 has already been worked on and load data if true
   * @returns Returns true, if data from stage2 is found
   */
  checkStage4Storage(): boolean {
    // Check if something is stored in the storage from step3
    let currentStorage = this.exchangeService.get('stage4');

    if(!currentStorage)
      return false;

    // Check if stage 2 storage is newer that stage 4 (load stage 2 if stage 2 is newer)
    let stage2Storage = this.exchangeService.get('stage2');
    if(stage2Storage && stage2Storage.timestamp && currentStorage.timestamp) {
      let stage2Update = new Date(stage2Storage.timestamp);
      let stage4Update = new Date(currentStorage.timestamp);

      // Stage 2 is newer than stage 3 -> Abort and load stage 2
      if(stage2Update > stage4Update)
        return false;
    }

    // Load the storage if not empty
    this.commentsAgree = currentStorage.agree;
    this.commentsDisagree = currentStorage.disagree;

    this.totalComments = this.commentsAgree.length + this.commentsDisagree.length;

    return true;
  }


  /**
   * Check stage2 if no stage4 data is found and load data if true
   * @returns Returns true, if data from stage2 is found
   */
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


  /**
   * Fired when something is typed into a comment
   */
  commentChange(event: any) {
    this.storeProgress();
    this.calculateProgress();
  }


  /**
   * Stores the current progress into the data
   */
  storeProgress() {
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('stage4');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.agree = this.commentsAgree;
    currentStorage.disagree = this.commentsDisagree;

    // Set timestamp
    currentStorage.timestamp = new Date().toISOString();

    // Write the storage object into the storage
    this.exchangeService.set('stage4', currentStorage);
  }


  /**
   * Calculates the current progress by checking filled comments
   */
  private calculateProgress() {

    let commentsFilled = this.getAmountCommented();

    this.exchangeService.setStep4Complete(commentsFilled >= this.totalComments);
    this.progressService.setProgress( (2/3) + (commentsFilled / this.totalComments) * (1/3) );

  }


  /**
   * Checks how many comments have been given
   */
  private getAmountCommented(): number {
    let commentsFilled = 0;
    for(let comment of this.commentsAgree) {
      if(comment[1] && comment[1] !== '')
        commentsFilled++;
    }

    for(let comment of this.commentsDisagree) {
      if(comment[1] && comment[1] !== '')
        commentsFilled++;
    }

    return commentsFilled;
  }


  // Getter / Setter

  getLabelAgree() {
    if(GlobalVars.CONF.getValue().design && GlobalVars.CONF.getValue().design.labelAgree)
      return GlobalVars.CONF.getValue().design.labelAgree;

    return "Agree";
  }

  getLabelDisagree() {
    if(GlobalVars.CONF.getValue().design && GlobalVars.CONF.getValue().design.labelDisagree)
      return GlobalVars.CONF.getValue().design.labelDisagree;

    return "Disagree";
  }
}
