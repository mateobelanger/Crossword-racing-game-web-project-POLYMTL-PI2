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
    }

    public displayPodiumTable(): void {
        this.endGameService.displayPodiumTable();
    }

    /* public firstPlayer(): number {
        // return 
    }*/

    public get raceTimes(): [string, RaceResults][] {
        return this.endGameService.raceResults;
    }
}
