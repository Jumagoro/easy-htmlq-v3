import { Injectable } from '@angular/core';
import { GlobalVars } from '../_config/global';
import { takeWhile} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ExchangeService } from './exchange.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private progress: BehaviorSubject<number> = new BehaviorSubject<number>(0); // 0-1

  public startDecimal: number = 0;  // start of the progress bar  (0.1-1)
  public endDecimal: number = 1;  // end percent of the progressbar (0-0.9)
  public progressBarEnabled: boolean = true;

  constructor(
    private exchangeService: ExchangeService
  ) {

    GlobalVars.CONF.pipe(
      takeWhile( (conf:any) => (Object.keys(conf).length === 0), true)
    ).subscribe(
      conf => {
        if((Object.keys(conf).length === 0))
          return;
           
        if(conf.progressBar && conf.progressBar.useEHQ3ProgressBar == false)
          this.progressBarEnabled = false;
        else {
          this.progressBarEnabled = true;
          this.startDecimal = conf.progressBar.startDecimal;
          this.endDecimal = conf.progressBar.endDecimal;
        }
      }
    );

    GlobalVars.DATA.pipe(
      takeWhile( (data:any) => (Object.keys(data).length === 0), true)
    ).subscribe(
      data => {
        if((Object.keys(data).length === 0))
          return;
           
          this.progress.next(data.progress.progress);
      }
    );

  }

  public get getProgress() {
    return this.progress;
  }

  public setProgress(progress: number) {

    this.progress.next(progress);
  
    // STORE PROGRESS IN
    // Load current storage to append the changed array
    let currentStorage = this.exchangeService.get('progress');

    // If nothing is in the storage, create an empty object
    if(!currentStorage)
      currentStorage = {};

    currentStorage.progress = progress;

    // Write the storage object into the storage
    this.exchangeService.set('progress', currentStorage);

    this.dispatchSosciProgressEvent();
  }

  public getTotalProgress(): number {
    return this.startDecimal + this.progress.getValue() * (this.endDecimal - this.startDecimal);
  }


  // Informs sosci about new progress being made
  public dispatchSosciProgressEvent() {

    document.getElementById('sosci-wrapper')?.dispatchEvent(new CustomEvent('ehq3_progress', {
      'detail': {
        progress: this.startDecimal + this.progress.getValue() * (this.endDecimal - this.startDecimal),
      }
    }));
    
  }


  public get getProgressBarEnabled() {
    return this.progressBarEnabled;
  }
}
