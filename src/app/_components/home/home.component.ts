import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { StepService } from 'src/app/_services/step-service.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  startModal!: Modal;

  modalLoaded: boolean = false;

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {

    this.stepService.setCurrentStep(-1);

    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => ((Object.keys(conf).length === 0)), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
          this.startModal = {
            message: conf.instructions.homeInstruction,
            okButton: conf.instructions.homeButton
          }

          // Hide modal until config is loaded (otherwise modal fires next and later loaded modal is skipped)
          this.modalLoaded = true;
      }
    );
    
  }

}
