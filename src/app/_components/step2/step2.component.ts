import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { StorageService } from 'src/app/_services/storage.service';

const xmlConverter = require('xml-js');

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    private stepService: StepService,
    private storageService: StorageService
  ) {}

  disagrees: string[] = [];
  neutrals: string[] = [];
  agrees: string[] = [];

  cols: string[][][] = [[[]]];  // Array with the cells holding the statements
  colColors: string[] = []; // Array with the color for each column
  colHeadings: string[] = [];   // Array with the cols headlines


  ngOnInit(): void {

    this.initCols();

    // When /step-2 is accessed directly by url the stepService wouldn't know that
    this.stepService.setCurrentStep(2);

    if(this.checkStep2Storage())
      return;

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

  
  drop(/*event: CdkDragDrop<string[]>*/ event: any) {

    if (event.previousContainer === event.container) {  // Same Container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else { // Different container
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.storeProgress();
    }

    if(this.agrees.length <= 0 && this.neutrals.length <= 0 && this.disagrees.length <= 0) {
      //this.stepService.nextStep();
    }
  }


  storeProgress() {
    let colCounter = 0;
    let cellCounter = 0;
    for(let col of this.cols) {
      for(let cell of col) {
        console.log('Col: ' + colCounter + ' Cell: ' + cellCounter + ': ' +cell[0]);
        cellCounter++;
      }
      colCounter++;
      cellCounter = 0;
    }
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
