import { Injectable } from '@angular/core';

const MAX_NB_LAPS: number = 3;

@Injectable()
export class RaceDataHandlerService {

  private _lapElapsed: number;
  private _timeLaps: number[];

  public constructor() {
    this._lapElapsed = 0;
    this._timeLaps = [0, 0, 0];
  }

  public get lapElapsed(): number {
    return this._lapElapsed;
  }

  public get timeLaps(): number[] {
    return this._timeLaps;
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
    // TODO:  totalTime -> results and best times
  }

  public totalTime(): number {
    return this._timeLaps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  private incLapElapsed(): void {
    this._lapElapsed++;
  }
}
