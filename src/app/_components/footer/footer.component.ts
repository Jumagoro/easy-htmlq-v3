import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { GlobalVars } from 'src/app/_config/global';
import { ModalService } from 'src/app/_services/modal-service.service';
import { ProgressService } from 'src/app/_services/progress.service';
import { StepService } from 'src/app/_services/step-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    public progressService: ProgressService,
    public stepService: StepService
  ) { }

  public static continueEnabled: boolean = false;

  ngOnInit(): void {
    
  }

  onHelpMe() {
    this.modalService.setVisible(true);
  }

  round(toRound: number): number {
    return Math.round(toRound);
  }

  onContinue() {
    FooterComponent.continueEnabled = false;
    this.stepService.nextStep()
  }

  public get getContinueEnabled() {
    return FooterComponent.continueEnabled;
  }
}
