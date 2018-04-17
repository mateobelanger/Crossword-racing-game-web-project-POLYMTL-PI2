import { Component, Input } from "@angular/core";
import { RaceResults } from "../../recordedTimes/raceResults";

@Component({
    selector: "app-time-show",
    templateUrl: "./time-show.component.html",
    styleUrls: ["./time-show.component.css"]
})
export class TimeShowComponent {
    public showLapsTime: boolean = false;
    @Input()
    public raceTime: RaceResults;

    public constructor() { }

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
