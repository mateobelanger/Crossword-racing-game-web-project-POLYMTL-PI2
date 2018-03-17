import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from "../best-time-handler.service";
@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class BestTimesComponent implements OnInit {

  public constructor( private bestTimesHandler: BestTimeHandlerService ) { }

  public ngOnInit(): void {
  }

  public get bestTimes(): [string, number][] {
    return this.bestTimesHandler.bestTimes;
  }
}
