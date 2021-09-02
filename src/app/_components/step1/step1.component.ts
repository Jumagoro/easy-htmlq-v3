import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/_services/step-service.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    private stepService: StepService
  ) {}

  statements = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  disagrees: string[] = ['Disagree'];
  neutrals: string[] = [];
  agrees: string[] = [];

  // When /step-1 is accessed directly by url the stepService wouldn't know that
  ngOnInit(): void {
    this.stepService.setCurrentStep(1);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      console.log('same container')
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('different container')
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    if(this.statements.length <= 0) {
      this.stepService.nextStep();
    }
  }

}
