import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { ProgressService } from 'src/app/_services/progress.service';
import { StepService } from 'src/app/_services/step-service.service';
import { FooterComponent } from '../footer/footer.component';
import { Modal } from '../modal/modal';
import { Statement, Type } from '../statement/statement';

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


  // Modal utility
  step2Modal!: Modal;
  modalLoaded: boolean = false;

  // Raw statements if step1 is disabled
  statements: Statement[] = [];

  // Arrays with the presorted statements from step1
  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  // Array with the cells holding the statements
  // Array with the color for each column
  // Array with the cols headlines
  cols: Statement[][][] = [[[]]];  
  colColors: string[] = []; 
  colHeadings: string[] = [];   

  // Disable presorted / raw statement containers at the bottom when finished
  nextStepAvailable: boolean = false;

  // Total amount of cols used to calculate the progress
  totalCols: number = 0;

  // Layout breaks into three / two / one line, depending on the given pxs
  oneLine: boolean = false;
  twoLine: boolean = false;

  
  /**
   * Retrieve information (config & data) used in this module
   */
  ngOnInit(): void {

    // Change layout on breakpoint for presort-row
    let localSelf = this;
    window.addEventListener("resize", function() {
      localSelf.onResizeRow();
    });
    this.onResizeRow();
     

    // When /step-2 is accessed directly by url the stepService wouldn't know that
    this.stepService.setFurthestStep(2);

    // Init cols if data is ready
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => (Object.keys(conf).length === 0), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
        // Create grid structure
        this.initCols();

        // Fill raw statements, if step1 disabled (possibly overwritten by data)
        if(this.step1Disabled()) {
          this.initStatements();
        }

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
           
        // Load state from stage2, if no data yet, import statements from stage1 (if not disabled)
        if(!this.checkStage2Storage() && !this.step1Disabled()) {

          // Load data from stage 1, if not disabled
          this.checkStage1PresortStorage();         
        }

        // Load raw statements left from disabled stage1
        if(this.step1Disabled())
          this.checkStage1RawStorage();
        
        this.storeProgress();
      }
    );

    // Check if already finished
    FooterComponent.continueEnabled = this.isNextStepAvailable();
  }


  /**
   * Loads all statements from the config to the raw statements array
   */
  private initStatements() {

    // Store all statements into the statements array
    for(let statement of GlobalVars.CONF.getValue().statements) {
      this.statements.push({
        id: statement.id
      });
    }
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
        this.totalCols++;
      }

    });
  }


  /**
   * Checks if there is any information left from the presort of step 1
   * @returns True, if there was some data found
   */
  checkStage1PresortStorage(): boolean {
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


  /**
   * If step1 is disabled, the raw statements are left in stage1->statements
   * Load the remaining raw statements to make them be sorted in step2
   */
  private checkStage1RawStorage(): void {
    let currentStorage = this.exchangeService.get('stage1');

    if(currentStorage && currentStorage.statements)
      this.statements = currentStorage.statements;
  }


  /**
   * Check if stage2 has already been worked on and load data if true
   * @returns Returns true, if data from stage2 is found
   */
  checkStage2Storage(): boolean {
    // Check if something is stored in the storage from step2
    //let currentStorage = this.storageService.get('step2');
    let currentStorage = this.exchangeService.get('stage2');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.cols)
      this.cols = currentStorage.cols;

    // Load unsorted statements stored in stage2 agrees, neutrals, ...
    if(currentStorage.agrees) {
      this.agrees = [];
      currentStorage.agrees.forEach( (val:any) => this.agrees.push(Object.assign({}, val)));
    }

    if(currentStorage.neutrals) {
      this.neutrals = [];
      currentStorage.neutrals.forEach( (val:any) => this.neutrals.push(Object.assign({}, val)));
    }

    if(currentStorage.disagrees) {
      this.disagrees = [];
      currentStorage.disagrees.forEach( (val:any) => this.disagrees.push(Object.assign({}, val)));
    }

    // Check if next step should be available
    this.nextStepAvailable = this.isNextStepAvailable();

    return true;
  }

  
  /**
   * Performs a statement switch after drop between two containers
   * @param event Event containing data about the source, target, etc.
   */
  drop(event: CdkDragDrop<Statement[]>) {
    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } // Swap if there is already a statement in the target container
    else if(event.container.data.length > 0) {

      let otherStatement = event.container.data[0];
      let previousContainer = event.previousContainer.data;
      delete event.container.data[0];

      // Put drag statement into new container
      transferArrayItem(previousContainer,
        event.container.data,
        event.previousIndex,
        0);

      // If previous container is from step 1, find the correct container for the other statement
      if( previousContainer == this.agrees ||
          previousContainer == this.neutrals ||
          previousContainer == this.disagrees)
      {
        if(otherStatement.type == Type.AGREE)
          previousContainer = this.agrees;
        else if(otherStatement.type == Type.NEUTRAL)
          previousContainer = this.neutrals;
        else if(otherStatement.type == Type.DISAGREE)
          previousContainer = this.disagrees;
        
      }

      // Transfer other statement into previous container
      transferArrayItem([otherStatement],
        previousContainer,
        0,
        0);

    } // Different container
    else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    // If step1 disabled, set new color of statement now
    if(this.step1Disabled()) {
      let colIndex = this.getColIndexOfCell(event.container.data);
      if(colIndex !== null) {
  
        let colValue = parseInt(this.colHeadings[colIndex]);      
        if(colValue < 0)
          event.container.data[0].type = Type.DISAGREE;
        else if(colValue == 0)
          event.container.data[0].type = Type.NEUTRAL;
        else if(colValue > 0)
          event.container.data[0].type = Type.AGREE;
      }
    }
    
    
    this.storeProgress();

    this.nextStepAvailable = this.isNextStepAvailable();
  }


  /**
   * Stores the current progress into the data
   */
  storeProgress() {

    // Store stage2 data
    this.storeStage2();

    // Calculate left statements
    let unsortedStatementsLeft = this.agrees.length + this.neutrals.length + this.disagrees.length;

    // Store remaining raw statements in stage1->statements
    if(this.step1Disabled()) {
      this.storeStage1();
      unsortedStatementsLeft = this.statements.length;
    }

    // Refresh progress
    this.progressService.setProgress( 1/3 + ((this.totalCols - unsortedStatementsLeft) / this.totalCols) * (1/3) );
    //this.progressService.setProgress( (1/3) + ((3 - unsortedStatementsLeft) / 3) * (1/3) ); // FOR TESTING ONLY

    FooterComponent.continueEnabled = this.isNextStepAvailable();
  }


  /**
   * Stores the progress of stage 2 in the data
   */
  private storeStage2() {
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
  }


  /**
   * Stores the unsorted statements to stage1 (only if stage1 is disabled)
   */
  private storeStage1() {
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('stage1');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    // Always store remaining statements
    currentStorage.statements = this.statements;

    // Set timestamp
    currentStorage.timestamp = new Date().toISOString();

    // Write the storage object into the storage
    this.exchangeService.set('stage1', currentStorage);
  }


  /**
   * Called when the window is resized -> Update presort layout
   */
   private onResizeRow() {

    // Row (div) containing the presorted statement containers
    let singlePresort: HTMLElement | null  = document.querySelector(".ehq3_presort-row");
    if (!(singlePresort instanceof HTMLElement)) {
      return;
    }

    // Set layout depending on the row's (div's) width
    this.onResize(singlePresort!.offsetWidth);
  }


  /**
   * Sets the presort layout depending on the given width
   * @param width  Width of the row / div of the presorted statement containers
   */
  private onResize(width: number) {

    // All container in one line
    if(width > 950) {
      this.twoLine = false;
      this.oneLine = true;
    }

    // Neutral container below agree & disagree
    else if(width > 650) {
      this.oneLine = false;
      this.twoLine = true;
    } 
    
    // All container below each other
    else {
      this.oneLine = false;
      this.twoLine = false;
    }
  }
  

  // Getter / Setter

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


  step1Disabled(): boolean {
    return this.stepService.isStepDisabled(1);
  }

  isNextStepAvailable(): boolean {
    if(!this.step1Disabled())
      return (this.agrees.length <= 0 && this.neutrals.length <= 0 && this.disagrees.length <= 0);
    else
      return this.statements.length <= 0;
  }


  /**
   * Gets the index of the column the given cell is in
   * @param cell  Cell to find in the grid
   * @returns Returns the column index of the cell in the grid
   */
  private getColIndexOfCell(cell: Statement[]): number | null {
    let colCurrent: Statement[][];
    for(let x = 0; x < this.cols.length; x++) {

      colCurrent = this.cols[x];

      for(let y = 0; y < colCurrent.length; y++) {
        if(colCurrent[y] === cell)
          return x;
      }
    }

    return null;
  }


  /**
   * Checks if the layout is for mobile devices
   * @returns True, if the layout is for mobile (all containers below each other)
   */
  public isMobile(): boolean {
    return !this.oneLine && !this.twoLine;
  }

  counter(i: number) {
    return new Array(i);
  }
}