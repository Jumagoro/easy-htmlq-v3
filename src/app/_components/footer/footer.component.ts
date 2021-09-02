import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_services/modal-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  // Shows the progress in the bar
  progress: number = 0.4;

  ngOnInit(): void {
  }

  onHelpMe() {
    this.modalService.setVisible(true);
  }

}
