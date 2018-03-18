import { Injectable } from '@angular/core';
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/trackData";
import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
import { RaceResultsService } from "./recordedTimes/race-results.service";


const HUNDREDTHSECOND: number = 10;

@Injectable()
export class RaceDataHandlerService {

  private _lapElapsed: number;
  private _timeLaps: number[];
  private timerId: number;
  private timerIdLap: number;
  private _hundrethSecondElapsed: number;
  private _hundrethSecondElapsedLap: number;
  private _iTrackData: ITrackData;
  private _position: number;

  public constructor( private tracksProxyService: TracksProxyService,
                      private bestTimesHandler: BestTimeHandlerService,
                      private raceResultService: RaceResultsService) {
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

  public get timeLaps(): number[] {
    return this._timeLaps;
  }

  public get hundrethSecondElapsed(): number {
      return this._hundrethSecondElapsed;
  }

  public get hundrethSecondElapsedLap(): number {
    return this._hundrethSecondElapsedLap;
  }

  public get position(): number {
    return this._position;
  }

  public startRace(): void {
    this.resetValues();
    this.startTimers();
  }

  public doneLap(name: string): void {
    this.raceResultService.doneLap(name, 1); // temporary
  }

  public doneRace(): void {
    this.stopTimers();
    this.bestTimesHandler.addTime(["test", this._hundrethSecondElapsed]);
    console.log(this.bestTimesHandler.bestTimes);
    // TODO:  totalTime -> results and best times
  }



  public totalTime(): number {
    return this._timeLaps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  private resetValues(): void {
    this._position = 1;
    this._lapElapsed = 0;
    this._timeLaps = [0, 0, 0];
    this._hundrethSecondElapsed = 0;
    this._hundrethSecondElapsedLap = 0;
  }

  private startTimers(): void {
    this.timerId = window.setInterval(() => { this._hundrethSecondElapsed++; }, HUNDREDTHSECOND);
    this.timerIdLap = window.setInterval(() => { this._hundrethSecondElapsedLap++; }, HUNDREDTHSECOND);
  }

  private stopTimers(): void {
    window.clearTimeout(this.timerId);
    window.clearTimeout(this.timerIdLap);
  }
}
