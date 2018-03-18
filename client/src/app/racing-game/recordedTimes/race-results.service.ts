import { Injectable } from '@angular/core';
import { RaceResults } from "./raceResults";
const AI_NAMES: string[] = ["bob1", "bob2", "bob3", "bob4", "bob5"];


@Injectable()
export class RaceResultsService {

  private _raceResults: {[name: string]: RaceResults};

  public constructor() {
    this._raceResults = {};

    AI_NAMES.forEach( (name) => {
        this._raceResults[name] = new RaceResults();
    });
   }

  public get raceResults(): {[name: string]: RaceResults} {
       return this._raceResults;
   }

  public doneLap( name: string, time: number): void {
    try {
        this._raceResults[name].doneLap(time);
    } catch (err) {
        console.error("no corresponding player name");
        console.error(err);
    }
   }

}
