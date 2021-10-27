import { Component, HostListener, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement, Type } from '../statement/statement';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { takeWhile } from 'rxjs/operators';
import { ProgressService } from 'src/app/_services/progress.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService,
    private exchangeService: ExchangeService,
    private progressService: ProgressService
  ) {}

  statements: Statement[] = [];

  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  totalStatements: number = 0;

  dataLoaded: boolean = false;

  // When /step-1 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {

    this.stepService.setCurrentStep(1);

    // Initialise with data 
    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
        let currentStorage = this.exchangeService.get('stage1');

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
      }
    );
    
    
  }

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


  /** Loads the statements from the xml config */
  private initStatements() {
    //let mapJSON = JSON.parse(xmlConverter.xml2json(xml, {compact: true, spaces: 4}));

    // Store all xml statements into the statements array
    for(let statement of GlobalVars.CONF.getValue().statements) {
      this.statements.push({
        id: statement.id,
        statement: statement.statement
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

    // Write the storage object into the storage
    this.exchangeService.set('stage1', currentStorage);

    // Refresh progress
    let totalStatementsSorted = this.agrees.length + this.neutrals.length + this.disagrees.length;
    this.progressService.setProgress(totalStatementsSorted / this.totalStatements * (1/3)); // Total of the first of three stages
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }

  
  /** Keylistener */
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
}