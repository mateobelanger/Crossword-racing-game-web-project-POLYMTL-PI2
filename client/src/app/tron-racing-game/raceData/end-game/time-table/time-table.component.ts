import { Component, NgZone } from "@angular/core";
import { RaceResults } from "../../recordedTimes/raceResults";
import { EndGameService } from "../../end-game/end-game.service";

@Component({
    selector: "app-time-table",
    templateUrl: "./time-table.component.html",
    styleUrls: ["./time-table.component.css"]
})
export class BestTimesComponent {

    public MOCKDATA: [string, RaceResults][];
    public SHOWMOCK: boolean = true;

    public constructor(private endGameService: EndGameService,
                       private zone: NgZone) { }

    public get bestTimes(): [string, number][] {
        return this.endGameService.bestTimes;
    }

    public restartGame(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }
}
