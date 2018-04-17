import { Injectable } from '@angular/core';
import { RaceResults } from "./raceResults";
import {PLAYERS_NAME } from "../../constants";
@Injectable()
export class RaceResultsService {

    private _raceResults: {[name: string]: RaceResults};

    public constructor() {
        this._raceResults = {};
    }

    public initialize(): void {
        PLAYERS_NAME.forEach( (name) => {
            this._raceResults[name] = new RaceResults();
        });
    }

    public getPlayerRaceResults(name: string): RaceResults {
        if ( this.isDefined(this._raceResults[name])) {
            return this._raceResults[name];
        } else {
            return new RaceResults();
        }
    }

    public get raceFinalResults(): [string, RaceResults][] {
        const raceFinalResults: [string, RaceResults][] = [];
        // tslint:disable-next-line:forin
        for (const key in this._raceResults) {
            raceFinalResults.push([key, this._raceResults[key]]);
        }
        raceFinalResults.sort(
            (result1: [string, RaceResults], result2: [string, RaceResults]) =>
            result1[1].totalTime - result2[1].totalTime
            );

        return raceFinalResults;
    }


    public doneLap( name: string, time: number): void {
        this.getPlayerRaceResults(name).doneLap(time);
    }

    /*tslint:disable:no-any*/
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }/*tslint:enable:no-any*/

}
