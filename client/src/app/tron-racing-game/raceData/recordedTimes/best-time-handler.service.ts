import { Injectable } from '@angular/core';
const MAX_NB_BEST_TIMES: number = 5;

@Injectable()
export class BestTimeHandlerService {

  private _bestTimes: [string, number][] = [];

  public constructor( ) {
  }

  public set bestTimes( bestTimes: [string, number][]) {
    this._bestTimes = bestTimes;
  }

  public get bestTimes(): [string, number][] {
        return this._bestTimes.sort((time1, time2) => (time1[1] - time2[1]));
  }

  public isBestTime(time: number): boolean {
      return this._bestTimes.length < MAX_NB_BEST_TIMES || time < this._bestTimes[this.findWorstTimeIndex()][1];
  }

  public addTime( time: [string, number]): void {
      if (this._bestTimes.length < MAX_NB_BEST_TIMES)
          this._bestTimes.push(time);
      else if (time[1] < this._bestTimes[this.findWorstTimeIndex()][1]) {
          this._bestTimes[this.findWorstTimeIndex()] = time;
      }
  }


  private findWorstTimeIndex(): number {
      let index: number = null;
      let maxTime: number = 0;
      this._bestTimes.forEach((element, i) => {
          if (element[1] > maxTime) {
              index = i;
              maxTime = element[1];
          }
      });

      return index;
  }

}
