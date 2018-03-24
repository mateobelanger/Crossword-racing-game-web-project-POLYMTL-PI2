import { Component, OnInit, NgZone } from '@angular/core';
import { BestTimeHandlerService } from "../best-time-handler.service";
import { RaceResults } from '../raceResults';

@Component({
    selector: 'app-time-table',
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.css']
})
export class BestTimesComponent implements OnInit {

    public MOCKDATA: [string, RaceResults][];
    public SHOWMOCK: boolean = true;


    public constructor(private bestTimesHandler: BestTimeHandlerService,
                       private zone: NgZone) { }

    public ngOnInit(): void {

    }

    public get bestTimes(): [string, number][] {
        return this.bestTimesHandler.bestTimes;
    }

    public restartGame(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }
}
