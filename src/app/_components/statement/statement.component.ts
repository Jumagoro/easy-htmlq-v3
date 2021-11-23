import { Component, Input, OnInit } from '@angular/core';
import { ExchangeService } from 'src/app/_services/exchange.service';
import { Statement, Type } from './statement';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {

  constructor(
    private exchangeService: ExchangeService
  ) {

  }

  // Reference to statement.ts Type enum for template
  Type = Type;
  
  @Input() statement!: Statement;

  ngOnInit(): void {

    // Card default color is grey
    if(this.statement && !this.statement.type)
      this.statement.type = Type.NEUTRAL;
  }

  /**
   * Gets the statement's text from the config via its ID
   * @returns String containing the text of the statement with the given id
   */
  public getStatementText(): string {
    return this.exchangeService.getStatementByID(this.statement.id);
  }

}
