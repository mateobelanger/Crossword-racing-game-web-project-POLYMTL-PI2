import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-congratulation-table',
    templateUrl: './congratulation-table.component.html',
    styleUrls: ['./congratulation-table.component.css']
})
export class CongratulationTableComponent implements OnInit {

    public constructor(private bestTimesHandler: BestTimeHandlerService,
                       private raceResultService: RaceResultsService,
                       private endGameService: EndGameService) { }


    public ngOnInit(): void {
    }

    public isNewBestTime(): boolean {
        return this.endGameService.isNewBestTime;
    }

    public displayTimeTable(): void {
        this.endGameService.displayTimeTable();
    }

    public displayResultTable(): void {
        this.endGameService.displayResultTable();
    }
}
