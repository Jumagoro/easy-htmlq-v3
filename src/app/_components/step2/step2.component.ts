import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement } from '../statement/statement';
import { StatementComponent } from '../statement/statement.component';

const xmlConverter = require('xml-js');

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService
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

    // Load step2-Storage and quit when successfull
    if(this.checkStep2Storage())
      return;

    // Load step1-storage if no step2-storage is found
    this.checkStep1Storage();
    
  }


  checkStep2Storage(): boolean {
    // Check if something is stored in the storage from step2
    let currentStorage = this.storageService.get('step2');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.agrees)
      this.agrees = currentStorage.agrees;
    if(currentStorage.neutrals)
      this.neutrals = currentStorage.neutrals;
    if(currentStorage.disagrees)
      this.disagrees = currentStorage.disagrees;
    if(currentStorage.cols)
      this.cols = currentStorage.cols;

    // Check if next step should be available
    if(this.agrees.length <= 0 && this.neutrals.length <= 0 && this.disagrees.length <= 0)
      this.nextStepAvailable = true;

    return true;
  }


  checkStep1Storage(): boolean {
    // Check if something is stored in the storage from step2
    let currentStorage = this.storageService.get('step1');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.agrees)
      this.agrees = currentStorage.agrees;
    if(currentStorage.neutrals)
      this.neutrals = currentStorage.neutrals;
    if(currentStorage.disagrees)
      this.disagrees = currentStorage.disagrees;

    return true;
  }

  
  drop(event: CdkDragDrop<Statement[]>) {

    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } // Abort if there's already a statement in the cell
    else if(event.container.data.length > 0) {
      return;
    } else { // Different container
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
    let currentStorage = this.storageService.get('step2');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.agrees = this.agrees;
    currentStorage.neutrals = this.neutrals;
    currentStorage.disagrees = this.disagrees;
    currentStorage.cols = this.cols;

    // Write the storage object into the storage
    this.storageService.set('step2', currentStorage);
  }

  counter(i: number) {
    return new Array(i);
  }

  private initCols() {

    this.cols = [];
    this.colColors = [];

    let mapJSON = JSON.parse(xmlConverter.xml2json(xml, {compact: true, spaces: 4}));

    mapJSON.map.column.forEach((value: any, index: any) => {

      this.cols[index] = [];
      this.colColors[index] = value._attributes.colour;;

      for(let i = 0; i < value._text; i++) {
        this.cols[index][i] = [];

        this.colHeadings[index] = value._attributes.id;
      }
    })

  }
}



const xml =
`
<?xml version="1.0" encoding="UTF-8"?>

<map version="1.0" htmlParse="false">
  <column id="-4" colour="FFD5D5">2</column>
  <column id="-3" colour="FFD5D5">3</column>
  <column id="-2" colour="FFD5D5">4</column>
  <column id="-1" colour="FFD5D5">5</column>
  <column id="0" colour="E9E9E9">5</column>
  <column id="1" colour="9FDFBF">5</column>
  <column id="2" colour="9FDFBF">4</column>
  <column id="3" colour="9FDFBF">3</column>
  <column id="4" colour="9FDFBF">2</column>
</map>
`
