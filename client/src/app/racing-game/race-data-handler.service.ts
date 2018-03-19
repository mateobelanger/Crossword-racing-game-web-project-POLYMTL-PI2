import { Injectable } from '@angular/core';
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/trackData";
import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
import { RaceResultsService } from "./recordedTimes/race-results.service";
import { Timer } from "./timer/timer";
const USERNAME: string = "user";

@Injectable()
export class RaceDataHandlerService {

  private _lapElapsed: number;
  private _timeLaps: number[];
  private _uiLapTimer: Timer;
  private _totalTimeTimer: Timer;
  private _iTrackData: ITrackData;
  private _position: number;

  public constructor( private tracksProxyService: TracksProxyService,
                      private bestTimesHandler: BestTimeHandlerService,
                      private raceResultService: RaceResultsService) {
    this._totalTimeTimer = new Timer();
    this._uiLapTimer = new Timer();
    this.resetValues();
  }

  public async initialize(trackname: string): Promise<void> {
    this.tracksProxyService.initialize()
    .then(() => {
      this._iTrackData = this.tracksProxyService.findTrack(trackname);
      this.bestTimesHandler.bestTimes = this._iTrackData.bestTimes;
     })
    .catch((err) => { console.error(err); });
  }

  public get lapElapsed(): number {
    return this._lapElapsed;
  }

  public get totalTimeElapsed(): number {
      return this._totalTimeTimer.hundrethSecondElapsed;
  }

  public get lapTimeElapsed(): number {
    return this._uiLapTimer.hundrethSecondElapsed;
  }

  public get position(): number {
    return this._position;
  }

  public startRace(): void {
    this.resetValues();
    this.startTimers();
  }

  // lap done from one player (ai or user)
  public doneLap(name: string): void {
    if (name === USERNAME)
      this._lapElapsed++;
    this.raceResultService.doneLap(name, this._totalTimeTimer.hundrethSecondElapsed);
  }

  public doneRace(): void {
    this.stopTimers();
    this.raceResultService.setRaceFinalResults();
  }



  public totalTime(): number {
    return this._timeLaps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  private resetValues(): void {
    this._position = 1;
    this._lapElapsed = 0;
    this._timeLaps = [0, 0, 0];
    this._uiLapTimer.reset();
    this._totalTimeTimer.reset();
  }

  private startTimers(): void {
    this._uiLapTimer.start();
    this._totalTimeTimer.start();
  }

  private stopTimers(): void {
    this._uiLapTimer.stop();
    this._totalTimeTimer.stop();
  }
}
