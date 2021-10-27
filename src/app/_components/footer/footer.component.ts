import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal-service.service';
import { ProgressService } from 'src/app/_services/progress.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    public progressService: ProgressService
  ) { }

  ngOnInit(): void {
    
  }

  onHelpMe() {
    this.modalService.setVisible(true);
  }

  round(toRound: number): number {
    return Math.round(toRound);
  }
}
