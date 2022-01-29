import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalVars } from 'src/app/_config/global';
import { ExchangeService } from 'src/app/_services/exchange.service';
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
    public stepService: StepService,
    private exchangeService: ExchangeService
  ) { }

  /** Enables the continue button on the footer */
  public static continueEnabled: boolean = false;

  ngOnInit(): void { }


  /**
   * Called when the user clicks the help-me-button
   */
  onHelpMe() {
    
    if(this.modalService.getVisible() == false) {

      // Notify sosci about help click
      this.exchangeService.dispatchSosciPresent(this.stepService.getCurrentStep, "help");

      this.modalService.setIsHelp(true);
      this.modalService.setVisible(true);
    }
    
  }

  /* Used to round the progress bar */
  round(toRound: number): number {
    return Math.round(toRound);
  }

  /**
   * Called when the user clicks the continue button
   */
  onContinue() {
    FooterComponent.continueEnabled = false;
    this.stepService.nextStep()
  }

  /**
   * Called when the user clicks the disabled continue button
   */
  onContinueDisabled() {
    
    //alert(this.getContinueDisabledAlert());
    if(confirm(this.getContinueDisabledAlert())) {
      this.onContinue();
    }
   
  }

  // Getter / Setter
  public get getContinueEnabled() {
    return FooterComponent.continueEnabled;
  }

  public static setContinueEnabled(enabled: boolean) {
    FooterComponent.continueEnabled = enabled;
  }

  // Reads the label / title for the continue button from the config
  getContinueLabel() {
    if(GlobalVars.CONF.getValue().footer && GlobalVars.CONF.getValue().footer.continueButtonText)
      return GlobalVars.CONF.getValue().footer.continueButtonText;
    else
      return 'Continue'
  }

  // Reads the label / title for the continue button from the config
  getContinueDisabledAlert() {
    if(GlobalVars.CONF.getValue().footer && GlobalVars.CONF.getValue().footer.continueAlert)
      return GlobalVars.CONF.getValue().footer.continueAlert;
    else
      return 'It seems haven\'t filled all fields yet. Do you still want to proceed with the next step (okay) or stay in this step (cancel)?';
  }

  // Reads the label / title for the continue button from the config
  getHelpMeLabel() {
    if(GlobalVars.CONF.getValue().footer && GlobalVars.CONF.getValue().footer.helpMeButtonText)
      return GlobalVars.CONF.getValue().footer.helpMeButtonText;
    else
      return 'Help me'
  }

  // Disable helpMeButton if given text is empty
  isHelpMeEnabled() {
    if(GlobalVars.CONF.getValue().footer && GlobalVars.CONF.getValue().footer.helpMeButtonText === '')
      return false;
    else
      return true;
  }


  /*getContinueDisabledAlert() {
    if(GlobalVars.CONF.getValue().instructions && GlobalVars.CONF.getValue().instructions.unfinishedText)
      return GlobalVars.CONF.getValue().instructions.unfinishedText;
    else
      return 'Please fill all expected fields.'
  }*/
}
