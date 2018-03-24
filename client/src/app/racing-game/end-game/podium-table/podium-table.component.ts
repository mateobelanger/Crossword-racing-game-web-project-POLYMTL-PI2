import { Component, OnInit } from '@angular/core';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-podium-table',
    templateUrl: './podium-table.component.html',
    styleUrls: ['./podium-table.component.css']
})
export class PodiumTableComponent implements OnInit {

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
