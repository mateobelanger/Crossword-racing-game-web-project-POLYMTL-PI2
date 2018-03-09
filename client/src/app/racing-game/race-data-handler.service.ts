import { Injectable } from '@angular/core';
import { BestTimesHandler } from './bestTimes/bestTimesHandler';

const MAX_NB_LAPS: number = 3;
const HUNDREDTHSECOND: number = 10;

@Injectable()
export class RaceDataHandlerService {

  private _lapElapsed: number;
  private _timeLaps: number[];
  private _bestTimesHandler: BestTimesHandler;
  private timerId: number;
  private _hundrethSecondElapsed: number;

  public constructor() {
    this._lapElapsed = 0;
    this._timeLaps = [0, 0, 0];
    this._bestTimesHandler = new BestTimesHandler();
  }

  public get lapElapsed(): number {
    return this._lapElapsed;
  }

  public get timeLaps(): number[] {
    return this._timeLaps;
  }

  public startRace(): void {
    this._lapElapsed = 0;
    this._timeLaps = [0, 0, 0];
    this.timerId = window.setInterval(() => { this._hundrethSecondElapsed++; }, HUNDREDTHSECOND);
  }

  public doneLap(newTotalTime: number): void {
    if (this._lapElapsed < MAX_NB_LAPS) {
      this._timeLaps[this._lapElapsed] = newTotalTime - this.totalTime();
      this.incLapElapsed();
      if (this._lapElapsed === MAX_NB_LAPS)
        this.doneRace();
    }

    // TODO: MODIFY DATA IN HUD 
  }

  private doneRace(): void {
    window.clearTimeout(this.timerId);
    // TODO:  totalTime -> results and best times
  }

  public get hundrethSecondElapsed(): number {
    return this._hundrethSecondElapsed;
  }

  public totalTime(): number {
    return this._timeLaps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  private incLapElapsed(): void {
    this._lapElapsed++;
  }
}
