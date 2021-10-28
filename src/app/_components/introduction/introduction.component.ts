import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  introductionModal!: Modal;

  modalLoaded: boolean = false;

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    this.stepService.setCurrentStep(-0);

    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => ((Object.keys(conf).length === 0)), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
          this.introductionModal = {
            message: conf.instructions.introductionInstruction,
            okButton: conf.instructions.introductionButton
          }

          // Hide modal until config is loaded (otherwise modal fires next and later loaded modal is skipped)
          this.modalLoaded = true;
      }
    );
  }

}
