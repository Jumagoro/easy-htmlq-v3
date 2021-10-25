import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement } from '../statement/statement';
import { StatementComponent } from '../statement/statement.component';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService,
    private exchangeService: ExchangeService
  ) {}

  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  cols: Statement[][][] = [[[]]];  // Array with the cells holding the statements
  colColors: string[] = []; // Array with the color for each column
  colHeadings: string[] = [];   // Array with the cols headlines

  nextStepAvailable: boolean = false;

  ngOnInit(): void {

    this.initCols();

    // When /step-2 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(2);

    // Load remaining statements from stage1
    this.checkStage1Storage();

    // Load already sorted statements from stage2
    this.checkStage2Storage();
    
    
  }


  checkStage1Storage(): boolean {
    // Check if something is stored in the storage from step2
    //let currentStorage = this.storageService.get('step1');
    let currentStorage = this.exchangeService.get('stage1');
    if(!currentStorage)
      return false;

    // Copy the storage if not empty (otherwise step1 storage gets overwritten)
    if(currentStorage.agrees)
      this.agrees = currentStorage.agrees;
    if(currentStorage.neutrals)
      this.neutrals = currentStorage.neutrals;
    if(currentStorage.disagrees)
      this.disagrees = currentStorage.disagrees;

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

    // Write the storage object into the storage
    this.exchangeService.set('stage2', currentStorage);


    // Store stage 1 as well
    currentStorage = this.exchangeService.get('stage1');

    if(!currentStorage)
    currentStorage = {};

    currentStorage.agrees = this.agrees;
    currentStorage.neutrals = this.neutrals;
    currentStorage.disagrees = this.disagrees;

    this.exchangeService.set('stage1', currentStorage);
  }

  counter(i: number) {
    return new Array(i);
  }

  private initCols() {

    this.cols = [];
    this.colColors = [];

    GlobalVars.CONF.structure.step2Columns.forEach((value:any, index:any) => {

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
    if(GlobalVars.CONF.structure.stage2TableName)
      return GlobalVars.CONF.structure.stage2TableName;
    else
      return 'Sort the cards according to your valuation'
  }
}