import { Component, OnInit } from '@angular/core';
import { RaceDataHandlerService} from "../../race-data-handler.service";

const TO_MINUTES: number = 60000;
const TO_SECONDS: number = 1000;
const MAX_SECONDS: number = 600;
const MAX_HUNDREDTH_SECOND: number = 1000;


@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  public constructor(private raceDataHandler: RaceDataHandlerService) { }

  public ngOnInit(): void {
  }

  public get totalHundredthSecond(): number {
    return this.raceDataHandler.totalTimeElapsed % MAX_HUNDREDTH_SECOND;
  }

  public get totalSecond(): number {
    return Math.floor(this.raceDataHandler.totalTimeElapsed / TO_SECONDS) % MAX_SECONDS;
  }

  public get totalMinutes(): number {
    return Math.floor(this.raceDataHandler.totalTimeElapsed / TO_MINUTES);
  }

  public get lapHundredthSecond(): number {
    return this.raceDataHandler.lapTimeElapsed % MAX_HUNDREDTH_SECOND;
  }

  public get lapSecond(): number {
    return Math.floor(this.raceDataHandler.lapTimeElapsed / TO_SECONDS) % MAX_SECONDS;
  }

  public get lapMinutes(): number {
    return Math.floor(this.raceDataHandler.lapTimeElapsed / TO_MINUTES);
  }
}
