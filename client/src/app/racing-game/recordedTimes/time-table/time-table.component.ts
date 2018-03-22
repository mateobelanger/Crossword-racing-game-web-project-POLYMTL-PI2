import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from "../best-time-handler.service";
import { RaceResultsService } from '../race-results.service';
import { RaceResults } from '../raceResults';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class BestTimesComponent implements OnInit {

  public MOCKDATA: [string, RaceResults][];
  public SHOWMOCK: boolean = true;

  public showBestTimes: boolean = false;
  public constructor( private bestTimesHandler: BestTimeHandlerService,
                      private raceResultService: RaceResultsService ) { }

  public ngOnInit(): void {
    this.createMockData(); // TO REMOVE
  }

  public get bestTimes(): [string, number][] {
    return this.bestTimesHandler.bestTimes;
  }


  public get raceTimes(): [string, RaceResults][] {
    if (this.SHOWMOCK)
      return this.MOCKDATA;

    return this.raceResultService.raceFinalResults;
  }


  // TO REMOVE
  public createMockData(): void {
    this.MOCKDATA = [
      ["Bobby Pendragon", new RaceResults()],
      ["Amos Daragon", new RaceResults()],
      ["Leonis", new RaceResults()],
      ["Pakal", new RaceResults()]
    ];

    // tslint:disable:no-magic-numbers
    this.MOCKDATA.forEach((element) => {
      for (let i: number = 0; i < 3; i++)
        element[1].doneLap(Math.random() * 20);
      element[1].calculateTotalTime();
    });
    this.MOCKDATA.sort((result1: [string, RaceResults], result2: [string, RaceResults]) =>
    result1[1].totalTime - result2[1].totalTime
    );
  }
}
