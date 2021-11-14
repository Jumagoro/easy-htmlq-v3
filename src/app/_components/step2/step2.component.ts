import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step2Component implements OnInit {

  constructor(
    public stepService: StepService,
    private exchangeService: ExchangeService,
    private progressService: ProgressService
  ) {}

  step2Modal!: Modal;
  modalLoaded: boolean = false;

  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  cols: Statement[][][] = [[[]]];  // Array with the cells holding the statements
  colColors: string[] = []; // Array with the color for each column
  colHeadings: string[] = [];   // Array with the cols headlines

  nextStepAvailable: boolean = false;

  totalCols: number = 0;

  ngOnInit(): void {

    // When /step-2 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(2);

    // Init cols if data is ready
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => (Object.keys(conf).length === 0), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
        this.initCols();

        this.step2Modal = {
          message: conf.instructions.step2Instruction,
          okButton: conf.instructions.step2Button
        }

        // Hide modal until config is loaded (otherwise modal fires next and later loaded modal is skipped)
        this.modalLoaded = true;
      }
    );

    // Load data if ready
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
        // Load remaining statements from stage1
        this.checkStage1Storage();

        // Load already sorted statements from stage2
        this.checkStage2Storage();
      }
    );

    // Check if already finished
    let unsortedStatementsLeft = this.agrees.length + this.neutrals.length + this.disagrees.length;

    if(unsortedStatementsLeft <= 0)
      FooterComponent.continueEnabled = true;

  }


  private initCols() {

    this.cols = [];
    this.colColors = [];

    GlobalVars.CONF.getValue().structure.step2Columns.forEach((value:any, index:any) => {

      this.cols[index] = [];
      this.colColors[index] = value.color;
      this.colHeadings[index] = value.id;

      for(let i = 0; i < value.amountCells; i++) {
        this.cols[index][i] = [];
        this.totalCols++;
      }

    });
  }


  checkStage1Storage(): boolean {
    // Check if something is stored in the storage from stage1
    let currentStorage = this.exchangeService.get('stage1');
    if(!currentStorage)
      return false;

    // Copy the storage if not empty (so step1 doesn't get overwritten)
    if(currentStorage.agrees)
      this.agrees = [];
      currentStorage.agrees.forEach( (val:any) => this.agrees.push(Object.assign({}, val)));

    if(currentStorage.neutrals)
      this.neutrals = [];
      currentStorage.neutrals.forEach( (val:any) => this.neutrals.push(Object.assign({}, val)));

    if(currentStorage.disagrees)
      this.disagrees = [];
      currentStorage.disagrees.forEach( (val:any) => this.disagrees.push(Object.assign({}, val)));

    return true;
  }


  checkStage2Storage(): boolean {
    // Check if something is stored in the storage from step2
    //let currentStorage = this.storageService.get('step2');
    let currentStorage = this.exchangeService.get('stage2');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.cols)
      this.cols = currentStorage.cols;

    // Check if next step should be available
    if(this.agrees.length <= 0 && this.neutrals.length <= 0 && this.disagrees.length <= 0)
      this.nextStepAvailable = true;

    return true;
  }

  
  drop(event: CdkDragDrop<Statement[]>) {
    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } // Abort if there's already a statement in the cell
    else if(event.container.data.length > 0) {

      let otherStatement = event.container.data[0];
      delete event.container.data[0];

      // Put drag statement into new container
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0);

      // Transfer other statement into previous container
      transferArrayItem([otherStatement],
        event.previousContainer.data,
        0,
        0);

    } // Different container
    else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.storeProgress();

    if(this.agrees.length <= 0 && this.neutrals.length <= 0 && this.disagrees.length <= 0) {
      this.nextStepAvailable = true;
    }
  }

  storeProgress() {
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('stage2');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.cols = this.cols;

    // Set timestamp
    currentStorage.timestamp = new Date().toISOString();

    if(this.agrees.length > 0)
      currentStorage.agrees = this.agrees;
    else
      delete currentStorage.agrees;

    if(this.neutrals.length > 0)
      currentStorage.neutrals = this.neutrals;
    else
      delete currentStorage.neutrals;

    if(this.disagrees.length > 0)
      currentStorage.disagrees = this.disagrees;
    else
      delete currentStorage.disagrees;

    // Set timestamp
    currentStorage.timestamp = new Date().toISOString();

    // Write the storage object into the storage
    this.exchangeService.set('stage2', currentStorage);

    // Refresh progress
    let unsortedStatementsLeft = this.agrees.length + this.neutrals.length + this.disagrees.length;
    this.progressService.setProgress( 1/3 + ((this.totalCols - unsortedStatementsLeft) / this.totalCols) * (1/3) );
    //this.progressService.setProgress( (1/3) + ((3 - unsortedStatementsLeft) / 3) * (1/3) ); // FOR TESTING ONLY

    if(unsortedStatementsLeft <= 0)
      FooterComponent.continueEnabled = true;
  }

  counter(i: number) {
    return new Array(i);
  }

  // Reads the label / title for the table from the config
  getTableLabel() {
    if(GlobalVars.CONF.getValue().structure && GlobalVars.CONF.getValue().structure.step2TableName)
      return GlobalVars.CONF.getValue().structure.step2TableName;
    else
      return 'Sort the cards according to your valuation'
  }

  getLabelNeutral() {
    if(GlobalVars.CONF.getValue().design && GlobalVars.CONF.getValue().design.labelNeutral)
      return GlobalVars.CONF.getValue().design.labelNeutral;

    return "Neutral";
  }

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