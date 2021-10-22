import { Component, HostListener, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/_services/storage.service';
import { Statement } from '../statement/statement';
import { COLOR_AGREE, COLOR_DISAGREE, COLOR_NEUTRAL } from 'src/app/_config/global';

const xmlConverter = require('xml-js');

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
        event.previousContainer.data[event.previousIndex].color = COLOR_AGREE;
      else if(event.container.data == this.neutrals)
        event.previousContainer.data[event.previousIndex].color = COLOR_NEUTRAL;
      else if(event.container.data == this.disagrees)
        event.previousContainer.data[event.previousIndex].color = COLOR_DISAGREE;

      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.storeProgress();
  }


  /** Loads the statements from the xml config */
  private initStatements() {
    let mapJSON = JSON.parse(xmlConverter.xml2json(xml, {compact: true, spaces: 4}));

    // Store all xml statements into the statements array
    for(let statement of mapJSON.statements.statement) {
      this.statements.push( {statement: statement._text} );
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
      targetStatement.color = COLOR_DISAGREE;
    }
      
    else if(event.key === '2') {
      targetStack = this.neutrals;
      targetStatement.color = COLOR_NEUTRAL;
    }
    else if(event.key === '3') {
      targetStack = this.agrees;
      targetStatement.color = COLOR_AGREE;
    }
    else
      return;

    // Move the statement to the new stack
    transferArrayItem(this.statements,targetStack, this.statements.length-1, 0);

    this.storeProgress();

  }
}


const xml =
`
<?xml version="1.0" encoding="UTF-8"?>

<statements version="1.0" htmlParse="false">
  <statement id="1"> I think the iPads helped to make a good learning environment for this class</statement>
  <statement id="2"> I learned concepts more easily in this class because we used the iPad </statement>
  <statement id="3"> I learned more from my classmates in this class than in my other classes because of the iPads</statement>
  <statement id="4"> The iPad helped me to learn things in this class that I would not have learned otherwise</statement>
  <statement id="5"> Using the iPad made it easier for me to make connections between the concepts used in the class </statement>
  <statement id="6"> Using iPads matches well with my preferred method of learning</statement>
  <statement id="7"> I feel using the iPads motivated me to work harder in this class</statement>
  <statement id="8"> I think that the iPad skills that I learned in this class will help me in other classes</statement>
  <statement id="9"> Using the iPad helped me to focus on the class concepts</statement>
  <statement id="10"> Using the iPad helped me to remember concepts from previous class sessions</statement>
  <statement id="11"> I participated more in this class than my other classes because of the iPads</statement>
  <statement id="12"> Using the iPads with Socrative made it easier for me to express my opinions on the course concepts</statement>
  <statement id="13"> It was interesting to use the iPads and Socrative to see the opinions of other students</statement>
  <statement id="14"> Using the iPads to give feedback on student presentations made them more interesting</statement>
  <statement id="15"> The Kahoot quizzes using iPads helped me to learn the course concepts</statement>
  <statement id="16"> Using the iPads in class made it more difficult for me to speak in English during class</statement>
  <statement id="17"> I wanted to use the iPad to access social media applications (LINE or Facebook) during class </statement>
  <statement id="18"> Using the iPads in this class wasted valuable class time</statement>
  <statement id="19"> It was difficult for me to understand how to use the iPad apps for this class</statement>
  <statement id="20"> Using the iPad in this class made the course concepts more confusing</statement>
  <statement id="21"> It was difficult to communicate my ideas using the iPad</statement>
  <statement id="22"> The iPad-related material was not well integrated with the other class material</statement>
  <statement id="23"> Having my opinions displayed in the screen in front of the class made me more reluctant to express my opinions</statement>
  <statement id="24"> I became bored while using the iPad during class</statement>
  <statement id="25"> I felt awkward when using the iPad because I am not as skilled with technology as other students seem to be</statement>
  <statement id="26"> The iPad made it more difficult for me to concentrate on the course concepts</statement>
  <statement id="27"> Using the iPad made it more difficult to speak in English with the Professor</statement>
  <statement id="28"> Using the iPad made it more difficult to speak in English with other students</statement>
  <statement id="29"> I lost some confidence in my ability to speak English during class because of the use of iPads</statement>
  <statement id="30"> Using iPads during class was inconvenient</statement>
  <statement id="31"> Use of the iPads didn’t improve the learning environment</statement>
  <statement id="32"> I feel more comfortable using technology after taking this classmates</statement>
  <statement id="33"> I wish more of my classes would use iPads  I wish more of my classes would use iPads  I wish more of my classes would use iPads  I wish more of my classes would use iPads  I wish more of my classes would use iPads  I wish more of my classes would use iPads</statement>
</statements>
`