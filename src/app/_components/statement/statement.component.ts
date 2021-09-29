import { Component, Input, OnInit } from '@angular/core';
import { Statement } from './statement';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {

  @Input() statement!: Statement;

  ngOnInit(): void {

    // Card default color is grey
    if(this.statement && (!this.statement.color || this.statement.color===''))
      this.statement.color='#e9e9e9';
  }

}
