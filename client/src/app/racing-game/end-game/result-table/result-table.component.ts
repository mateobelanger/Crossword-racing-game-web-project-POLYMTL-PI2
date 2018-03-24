import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { RaceResults } from '../../recordedTimes/raceResults';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-result-table',
    templateUrl: './result-table.component.html',
    styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {

    public MOCKDATA: [string, RaceResults][];
    public SHOWMOCK: boolean = true;


    public constructor(private bestTimesHandler: BestTimeHandlerService,
                       private raceResultService: RaceResultsService,
                       private endGameService: EndGameService) { }

    public ngOnInit(): void {
        this.createMockData(); // TO REMOVE
    }

    public displayCongratulationTable(): void {
        this.endGameService.displayCongratulationTable();
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
