import { Injectable } from "@angular/core";
import { RaceProgression } from "./raceProgression";
import { USERNAME } from "../../constants";
import { Subject } from "rxjs/Subject";

@Injectable()
export class RaceProgressionHandlerService {

    private _playersProgression: {[playerName: string]: RaceProgression};
    private _userProgression: RaceProgression;
    private _lapDoneStream$: Subject<string>;
    private _raceDoneStream$: Subject<string>;

    public constructor() {
        this._playersProgression = {};
        this._lapDoneStream$ = new Subject();
        this._raceDoneStream$ = new Subject();
        this._userProgression = new RaceProgression();
    }

    public async initialize(carsPosition: {[playerName: string]: THREE.Vector3}, waypoints: [number, number, number][]): Promise<void> {
        return new Promise<void>( (resolve: Function, reject: Function) => {
            for (const playerName in carsPosition) {
                if (carsPosition.hasOwnProperty(playerName)) {
                    if (playerName === USERNAME) {
                        this._userProgression = new RaceProgression(carsPosition[playerName], waypoints);
                        this._playersProgression[playerName] = this._userProgression;
                    } else {
                        this._playersProgression[playerName] = new RaceProgression(carsPosition[playerName], waypoints);
                    }
                }
            }
            this.initializeLapDoneStream();
            this.initializeRaceDoneStream();
            resolve();
        });
    }

    public update(): void {
        for (const playerName in this._playersProgression) {
            if (this._playersProgression.hasOwnProperty(playerName)) {
                    this._playersProgression[playerName].update();
            }
        }
    }

    public get lapDoneStream$(): Subject<string> {
        return this._lapDoneStream$;
    }

    public get raceDoneStream$(): Subject<string> {
        return this._raceDoneStream$;
    }

    public get user(): RaceProgression {
        return this._userProgression;
    }

    public get userPosition(): number {
        let position: number = 1;
        for (const playerName in this._playersProgression) {
            if (this._playersProgression.hasOwnProperty(playerName)) {
                if (this._playersProgression[playerName].nLap > this.user.nLap) {
                    position++;
                } else if (this._playersProgression[playerName].nLap === this.user.nLap) {
                    if (this._playersProgression[playerName].nextWaypointIndex > this.user.nextWaypointIndex) {
                        position++;
                    } else if (this._playersProgression[playerName].nextWaypointIndex === this.user.nextWaypointIndex) {
                        if (this._playersProgression[playerName].distanceToNextWaypoint() < this.user.distanceToNextWaypoint()) {
                            position++;
                        }
                    }
                }
            }
        }

        return position;
    }

    public isUserFirst(): boolean {
        return this.userPosition === 1;
    }

    public get unfinishedPlayers(): [string, RaceProgression][] {
        const unfinishedPlayers: [string, RaceProgression][] = [];
        for (const key in this._playersProgression) {
            if (this._playersProgression.hasOwnProperty(key)) {
                if (this._playersProgression[key].isFinished) {
                    unfinishedPlayers.push([key, this._playersProgression[key]]);
                }
            }
        }

        return unfinishedPlayers;
    }

    public getPlayerProgression(playerName: string): RaceProgression {
        return this._playersProgression[playerName];
    }

    private initializeLapDoneStream(): void {
        for (const playerName in this._playersProgression) {
            if (this._playersProgression.hasOwnProperty(playerName)) {
                this._playersProgression[playerName].lapDone$.subscribe( () => {
                    this._lapDoneStream$.next(playerName);
                });
            }
        }
    }

    private initializeRaceDoneStream(): void {
        for (const playerName in this._playersProgression) {
            if (this._playersProgression.hasOwnProperty(playerName)) {
                this._playersProgression[playerName].endOfRace$.subscribe( () => {
                    this._raceDoneStream$.next(playerName);
                });
            }
        }
    }

}
