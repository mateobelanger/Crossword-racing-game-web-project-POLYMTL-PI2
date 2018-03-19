import { Injectable } from '@angular/core';
import { RaceResults } from "./raceResults";
const AI_NAMES: string[] = ["bob1", "bob2", "bob3", "bob4", "bob5"];
const USERNAME: string = "user";

@Injectable()
export class RaceResultsService {

    private _raceResults: {[name: string]: RaceResults};
    private _raceFinalResults: [string, RaceResults][];

    public constructor() {
    this._raceResults = {};
    this._raceFinalResults = [];

    AI_NAMES.forEach( (name) => {
        this._raceResults[name] = new RaceResults();
    });
    this._raceResults[USERNAME] = new RaceResults();
    }

    public get raceResults(): {[name: string]: RaceResults} {
        return this._raceResults;
    }

    public get raceFinalResults(): [string, RaceResults][] {
        return this._raceFinalResults;
    }

    public setRaceFinalResults(): void { // CALL BEFORE SHOW RACE RESULT
        // tslint:disable-next-line:forin
        for (const key in this._raceResults) {
            this._raceFinalResults.push([key, this._raceResults[key]]);
        }
        this._raceFinalResults.sort(
            (result1: [string, RaceResults], result2: [string, RaceResults]) =>
            result1[1].totalTime - result2[1].totalTime
            );
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
