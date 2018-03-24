import { Component, OnInit, NgZone } from '@angular/core';
import { RaceResults } from '../raceResults';
import { EndGameService } from '../../end-game/end-game.service';

@Component({
    selector: 'app-time-table',
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.css']
})
export class BestTimesComponent implements OnInit {

    public MOCKDATA: [string, RaceResults][];
    public SHOWMOCK: boolean = true;


    public constructor(private endGameService: EndGameService,
                       private zone: NgZone) { }

    public ngOnInit(): void {

    }

    public get bestTimes(): [string, number][] {
        return this.endGameService.bestTimes;
    }

    public restartGame(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }
}
