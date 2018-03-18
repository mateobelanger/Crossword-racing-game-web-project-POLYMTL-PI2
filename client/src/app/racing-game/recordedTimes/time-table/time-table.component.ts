import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from "../best-time-handler.service";
// import { RaceDataHandlerService } from '../../race-data-handler.service';
@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class BestTimesComponent implements OnInit {

  public showBestTimes: boolean = false;
  public constructor( private bestTimesHandler: BestTimeHandlerService,
                      /*private raceDataHandler: RaceDataHandlerService*/ ) { }

  public ngOnInit(): void {
  }

  public get bestTimes(): [string, number][] {
    return this.bestTimesHandler.bestTimes;
  }

  public get personnalTimes(): number[] {
    return [1, 1, 1]; // this.raceDataHandler.timeLaps;
  }
}
