import { Component, Input } from "@angular/core";
import { RaceResults } from "../../recordedTimes/raceResults";

@Component({
    selector: "app-time-show",
    templateUrl: "./time-show.component.html",
    styleUrls: ["./time-show.component.css"]
})
export class TimeShowComponent {
    @Input()
    public raceTime: RaceResults;
    public showLapsTime: boolean;

    public constructor() {
        this.showLapsTime = false;
     }

    public showLapTime(): void {
        if (!this.showLapsTime) {
            this.showLapsTime = true;
        }
    }

    public hideLapTime(): void {
        if (this.showLapsTime) {
            this.showLapsTime = false;
        }
    }
}
