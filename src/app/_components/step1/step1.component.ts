import { Component, HostListener, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement, Type } from '../statement/statement';
import { GlobalVars } from 'src/app/_config/global';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService
  ) {}

  statements: Statement[] = [];

  disagrees: Statement[] = [];
  neutrals: Statement[] = [];
  agrees: Statement[] = [];

  // When /step-1 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(1);

    // Check if something is stored in the storage
    let currentStorage = this.storageService.get('step1');
    if(!currentStorage) {
      this.initStatements();
      return;
    }
      

    // Load the storage if not empty
    if(currentStorage.statements)
      this.statements = currentStorage.statements;
    if(currentStorage.agrees)
      this.agrees = currentStorage.agrees;
    if(currentStorage.neutrals)
      this.neutrals = currentStorage.neutrals;
    if(currentStorage.disagrees)
      this.disagrees = currentStorage.disagrees;
    
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
    for(let statement of GlobalVars.CONF.statements) {
      this.statements.push({
        id: statement.id,
        statement: statement.statement
      });
    }
  }


  /**
   * Stores the progress in the storage
   */
  private storeProgress() {

    // Load current storage to append the changed array
    let currentStorage = this.storageService.get('step1');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    // Always store remaining statements
    currentStorage.statements = this.statements;
    currentStorage.agrees = this.agrees; 
    currentStorage.neutrals = this.neutrals;
    currentStorage.disagrees = this.disagrees;

    // Write the storage object into the storage
    this.storageService.set('step1', currentStorage);
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
    console.log(targetStack);

    this.storeProgress();

  }
}