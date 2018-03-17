import { Injectable } from '@angular/core';
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/trackData";
import { BestTimeHandlerService } from './bestTimes/best-time-handler.service';
import { LoadingTrackHandlerService } from './loading-track-handler.service';
const MAX_NB_LAPS: number = 3;
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
  private _username: string = "default"; // à changer .ventuellement
  public constructor( private tracksProxyService: TracksProxyService,
                      private bestTimesHandler: BestTimeHandlerService,
                      private loadingTrackHandler: LoadingTrackHandlerService) {
    this.resetValues();
  }

  public async initialize(trackname: string): Promise<void> {
      this.tracksProxyService.initialize()
      .then(() => {
          this._iTrackData = this.tracksProxyService.findTrack(trackname);
          this.bestTimesHandler.bestTimes = this._iTrackData.bestTimes;
          this.loadingTrackHandler.points = this._iTrackData.waypoints;
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

  public get iTrackData(): ITrackData {
      return this._iTrackData;
  }

  public startRace(): void {
      this.resetValues();
      this.startTimers();
  }

  public doneLap(): void {
      if (this._lapElapsed < MAX_NB_LAPS) {
          this._timeLaps[this._lapElapsed] = this._hundrethSecondElapsedLap;
          this._hundrethSecondElapsedLap = 0;
          this.incLapElapsed();
          if (this._lapElapsed === MAX_NB_LAPS)
              this.doneRace();
      }
  }

  private doneRace(): void {
      this.stopTimers();
      this.bestTimesHandler.addTime([this._username, this._hundrethSecondElapsed]);
      console.log(this.bestTimesHandler.bestTimes);
      // TODO:  totalTime -> results and best times
  }



  public totalTime(): number {
      return this._timeLaps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  private incLapElapsed(): void {
      this._lapElapsed++;
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
