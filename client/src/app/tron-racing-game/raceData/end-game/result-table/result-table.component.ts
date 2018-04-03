import { Component, OnInit } from '@angular/core';
import { RaceResults } from '../../recordedTimes/raceResults';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-result-table',
    templateUrl: './result-table.component.html',
    styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {

    public MOCKDATA: [string, RaceResults][];
    public SHOWMOCK: boolean = false;


    public constructor(private endGameService: EndGameService) { }

    public ngOnInit(): void {
        this.createMockData(); // TO REMOVE
    }

    public displayPodiumTable(): void {
        this.endGameService.displayPodiumTable();
    }

    public get raceTimes(): [string, RaceResults][] {
        // todo: remove
        if (this.SHOWMOCK)
            return this.MOCKDATA;
        console.log(this.endGameService.raceResults)
        return this.endGameService.raceResults;
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
