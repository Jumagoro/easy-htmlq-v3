import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    private stepService: StepService,
    private storageService: StorageService
  ) {}

  statements = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  disagrees: string[] = [];
  neutrals: string[] = [];
  agrees: string[] = [];

  // When /step-1 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(1);

    // Check if something is stored in the storage
    let currentStorage = this.storageService.get('step1');
    if(!currentStorage)
      return;

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

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.statements);
    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else { // Different container
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.storeProgress();
    }

    if(this.statements.length <= 0) {
      this.stepService.nextStep();
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

}
