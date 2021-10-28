import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { FooterComponent } from '../footer/footer.component';
import { Modal } from '../modal/modal';
import { Statement } from '../statement/statement';
import { StatementComponent } from '../statement/statement.component';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService,
    private exchangeService: ExchangeService
  ) {}

  step3Modal!: Modal;
  modalLoaded: boolean = false;

  cols: Statement[][][] = [[[]]];  // Array with the cells holding the statements
  colColors: string[] = []; // Array with the color for each column
  colHeadings: string[] = [];   // Array with the cols headlines


  ngOnInit(): void {

    // When /step-3 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(3);

    // Init cols if data is ready
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => (Object.keys(conf).length === 0), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
        this.initCols();

        this.step3Modal = {
          message: conf.instructions.step3Instruction,
          okButton: conf.instructions.step3Button
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

        // Load already sorted statements from stage2
        this.checkStage2Storage();
      }
    );
    
    
    FooterComponent.continueEnabled = true;
  }


  checkStage2Storage(): boolean {
    // Check if something is stored in the storage from stage2
    let currentStorage = this.exchangeService.get('stage2');

    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.cols)
      this.cols = currentStorage.cols;

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

    // Write the storage object into the storage
    this.exchangeService.set('stage2', currentStorage);
  }

  counter(i: number) {
    return new Array(i);
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
      }

    });
  }

  // Reads the label / title for the table from the config
  getTableLabel() {
    if(GlobalVars.CONF.getValue().structure && GlobalVars.CONF.getValue().structure.stage2TableName)
      return GlobalVars.CONF.getValue().structure.stage2TableName;
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
