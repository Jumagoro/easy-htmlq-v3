import { Component, Input, OnInit } from '@angular/core';
import { Statement, Type } from './statement';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {

  // Reference to statement.ts Type enum for template
  Type = Type;
  
  @Input() statement!: Statement;

  ngOnInit(): void {

    // Card default color is grey
    if(this.statement && !this.statement.type)
      this.statement.type = Type.NEUTRAL;
  }

}
