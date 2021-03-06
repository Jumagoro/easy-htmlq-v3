import { Component, HostListener, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Statement, Type } from '../statement/statement';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { takeWhile } from 'rxjs/operators';
import { ProgressService } from 'src/app/_services/progress.service';
import { Modal } from '../modal/modal';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step1Component implements OnInit {


  constructor(
    public stepService: StepService,
    private exchangeService: ExchangeService,
    private progressService: ProgressService,
    private zone: NgZone
  ) {}


  step1Modal!: Modal;
  introductionModal!: Modal;
  modalLoaded: boolean = false;

  statements: Statement[] = [];

  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  totalStatements: number = 0;

  dataLoaded: boolean = false;

  oneLine: boolean = false;
  twoLine: boolean = false;
  

  /**
   * Retrieve information (config & data) used in this module
   */
  ngOnInit(): void {

    // Fix breakpoint for presort-row
    let localSelf = this;
    window.addEventListener("resize", function() {
      localSelf.onResizeRow();
    });
    this.onResizeRow();

    this.stepService.setFurthestStep(0);

    // Initialise with data 
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
        let currentStorage = this.exchangeService.get('stage1');

        if(!currentStorage)
          return;

        this.dataLoaded = true;

        if(currentStorage.statements)
          this.statements = currentStorage.statements;
        if(currentStorage.agrees)
          this.agrees = currentStorage.agrees;
        if(currentStorage.neutrals)
          this.neutrals = currentStorage.neutrals;
        if(currentStorage.disagrees)
          this.disagrees = currentStorage.disagrees;

        this.totalStatements = this.statements.length + this.agrees.length + this.neutrals.length + this.disagrees.length;
      }
    );
    
    // Initialise with config if no data is provided (data may override later) 
    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => ((Object.keys(conf).length === 0) && !this.dataLoaded), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0) || this.dataLoaded)
          return;
           
        this.initStatements();

        this.step1Modal = {
          message: conf.instructions.step1Instruction,
          okButton: conf.instructions.step1Button
        }

        this.introductionModal = {
          message: conf.instructions.introductionInstruction,
          okButton: conf.instructions.introductionButton
        }

        // Hide modal until config is loaded (otherwise modal fires next and later loaded modal is skipped)
        this.modalLoaded = true;
      }
    );
    
    // Check if already finished
    if(this.statements.length <= 0)
      FooterComponent.continueEnabled = true;
  }


  /**
   * Performs a statement switch after drop between two containers
   * @param event Event containing data about the source, target, etc.
   */
  drop(event: CdkDragDrop<Statement[]>) {
    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else { // Different container

      // Change color of statement in different stacks
      if(event.container.data == this.agrees)
        event.previousContainer.data[event.previousIndex].type = Type.AGREE;
      else if(event.container.data == this.neutrals)
        event.previousContainer.data[event.previousIndex].type = Type.NEUTRAL;
      else if(event.container.data == this.disagrees)
        event.previousContainer.data[event.previousIndex].type = Type.DISAGREE;

      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.storeProgress();
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

    this.totalStatements = this.statements.length + this.agrees.length + this.neutrals.length + this.disagrees.length;
  }


  /**
   * Stores the progress in the storage
   */
  private storeProgress() {

    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('stage1');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    // Always store remaining statements
    currentStorage.statements = this.statements;
    currentStorage.agrees = this.agrees; 
    currentStorage.neutrals = this.neutrals;
    currentStorage.disagrees = this.disagrees;

    // Set timestamp
    currentStorage.timestamp = new Date().toISOString();

    // Write the storage object into the storage
    this.exchangeService.set('stage1', currentStorage);

    // Refresh progress
    let totalStatementsSorted = this.agrees.length + this.neutrals.length + this.disagrees.length;
    this.progressService.setProgress(totalStatementsSorted / this.totalStatements * (1/3)); // Total of the first of three stages

    if(this.statements.length <= 0)
      FooterComponent.continueEnabled = true;
  }

  /**
   * Predicate function that doesn't allow items to be dropped into a list.
   */
  noReturnPredicate() {
    return false;
  }

  
  /**
   * Keylistener
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 

    let targetStack: Statement[];

    if(this.statements.length <= 0)
      return;

    // Take the top most statement
    let targetStatement = this.statements[this.statements.length - 1];

    // Determine target stack & color
    if(event.key === '1') {
      targetStack = this.disagrees;
      targetStatement.type = Type.DISAGREE;
    }
    else if(event.key === '2') {
      targetStack = this.neutrals;
      targetStatement.type = Type.NEUTRAL;
    }
    else if(event.key === '3') {
      targetStack = this.agrees;
      targetStatement.type = Type.AGREE;
    }
    else
      return;

    // Move the statement to the new stack
    transferArrayItem(this.statements, targetStack, this.statements.length-1, 0);

    this.storeProgress();
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

  /**
   * Checks if the layout is for mobile devices
   * @returns True, if the layout is for mobile (all containers below each other)
   */
  public isMobile(): boolean {
    return !this.oneLine && !this.twoLine;
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
