import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from "../best-time-handler.service";
@Component({
  selector: 'app-best-times',
  templateUrl: './best-times.component.html',
  styleUrls: ['./best-times.component.css']
})
export class BestTimesComponent implements OnInit {

  public constructor( private bestTimesHandler: BestTimeHandlerService ) { }

  public ngOnInit(): void {
  }

  public get bestTimes(): [string, number][] {
    return this.bestTimesHandler.bestTimes;
  }
}
