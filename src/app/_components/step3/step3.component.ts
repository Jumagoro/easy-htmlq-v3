import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { StepService } from 'src/app/_services/step-service.service';
import { FooterComponent } from '../footer/footer.component';
import { Modal } from '../modal/modal';
import { Statement } from '../statement/statement';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step3Component implements OnInit {


  constructor(
    public stepService: StepService,
    private exchangeService: ExchangeService
  ) {}

  /* Modal utility */
  step3Modal!: Modal;
  modalLoaded: boolean = false;

  // Array with the cells holding the statements
  // Array with the color for each column
  // Array with the cols headlines
  cols: Statement[][][] = [[[]]];
  colColors: string[] = [];
  colHeadings: string[] = [];


  /**
   * Retrieve information (config & data) used in this module
   */
  ngOnInit(): void {

    // When /step-3 is accessed directly by url the stepService wouldn't know that
    this.stepService.setFurthestStep(3);

    // Init cols if data is ready
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => (Object.keys(conf).length === 0), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
        // Create grid structure
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


  /**
   * Check if stage2 has already been worked on and load data if true
   * @returns Returns true, if data from stage2 is found
   */
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


  /**
   * Performs a statement switch after drop between two containers
   * @param event Event containing data about the source, target, etc.
   */
  drop(event: CdkDragDrop<Statement[]>) {
    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } // Swap if there is another statement in the container
    else if(event.container.data.length > 0) {

      // Temp storage of other statement
      let otherStatement = event.container.data[0];
      delete event.container.data[0];

      // Save information about swaps (only in this module)
      this.storeSwap(
        event.previousContainer.data[0].id,
        otherStatement.id,
        event.previousContainer.data,
        event.container.data);      

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

    } // Empty, different container
    else {

      this.storeSwap(
        event.previousContainer.data[0].id,
        -1,
        event.previousContainer.data,
        event.container.data);

      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      
    }
    this.storeProgress();
  }


  /**
   * Stores the current progress into the data
   */
  private storeProgress() {
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


  // Saves the indizes of the swapped elements in step3swap
  private storeSwap(idMovedStatement: number, idPassiveStatement: number,
                    previousContainer: Statement[], newContainer: Statement[]) {

    let indexPrevCol: number = -1;
    let indexNewCol: number = -1;

    // Get col/row index of both containers
    for(let x = 0; x < this.cols.length; x++) {
      for(let y = 0; y < this.cols[x].length; y++) {

        // Is current container the previous one?
        if(this.cols[x][y] == previousContainer)
          indexPrevCol = x;

        // Is current container the new one?
        else if(this.cols[x][y] == newContainer)
          indexNewCol = x;
      }
    }

    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('step3swap') as any[];

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = [];

    currentStorage.push({
      s1: idMovedStatement,
      s0: idPassiveStatement,
      c1: indexNewCol,
      c0: indexPrevCol });

    // Write the storage object into the storage
    this.exchangeService.set('step3swap', currentStorage);

  }

  
  /**
   * Initializes the grid
   * - Create array for each cell
   * - Fill headings with value
   * - Fill colors with value
   */
  private initCols() {

    this.cols = [];
    this.colColors = [];

    GlobalVars.CONF.getValue().structure.gridColumns.forEach((value:any, index:any) => {

      this.cols[index] = [];
      this.colColors[index] = value.color;

      if(value.id > 0)
        this.colHeadings[index] = '+' + value.id;
      else
        this.colHeadings[index] = value.id;

      for(let i = 0; i < value.amountCells; i++) {
        this.cols[index][i] = [];
      }

    });
  }


  // Getter / Setter

  // Reads the label / title for the table from the config
  getTableLabel() {
    if(GlobalVars.CONF.getValue().structure && GlobalVars.CONF.getValue().structure.step3TableName)
      return GlobalVars.CONF.getValue().structure.step3TableName;
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


  // Utility for gui
  counter(i: number) {
    return new Array(i);
  }

  public getIndexOfCenterCol() {
    return Math.floor(this.cols.length/2);
  }
}
