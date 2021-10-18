import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement } from '../statement/statement';
import { StatementComponent } from '../statement/statement.component';

const xmlConverter = require('xml-js');

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  constructor(
    public stepService: StepService,
    private storageService: StorageService
  ) {}

  cols: Statement[][][] = [[[]]];  // Array with the cells holding the statements
  colColors: string[] = []; // Array with the color for each column
  colHeadings: string[] = [];   // Array with the cols headlines


  ngOnInit(): void {

    this.initCols();

    // When /step-2 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(3);

    // Load step2-Storage and quit when successfull
    if(this.checkStep3Storage())
      return;

    // Load step2-storage if no step3-storage is found
    this.checkStep2Storage();
    
  }


  checkStep3Storage(): boolean {
    // Check if something is stored in the storage from step3
    let currentStorage = this.storageService.get('step3');
    if(!currentStorage)
      return false;

    // Load the storage if not empty
    if(currentStorage.cols)
      this.cols = currentStorage.cols;

    return true;
  }


  checkStep2Storage(): boolean {
    // Check if something is stored in the storage from step2
    let currentStorage = this.storageService.get('step2');
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
    let currentStorage = this.storageService.get('step3');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.cols = this.cols;

    // Write the storage object into the storage
    this.storageService.set('step3', currentStorage);
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
  <column id="-4" colour="#FFD5D5">2</column>
  <column id="-3" colour="#FFD5D5">3</column>
  <column id="-2" colour="#FFD5D5">4</column>
  <column id="-1" colour="#FFD5D5">5</column>
  <column id="0" colour="#E9E9E9">5</column>
  <column id="1" colour="#9FDFBF">5</column>
  <column id="2" colour="#9FDFBF">4</column>
  <column id="3" colour="#9FDFBF">3</column>
  <column id="4" colour="#9FDFBF">2</column>
</map>
`
