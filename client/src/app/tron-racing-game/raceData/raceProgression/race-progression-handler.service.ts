import { Injectable } from '@angular/core';
import { RaceProgression } from './raceProgression';
import { MAX_N_LAPS, USERNAME } from "../../constants";
import { Subject } from 'rxjs/Subject';



@Injectable()
export class RaceProgressionHandlerService {

    private _playersProgression: [string, RaceProgression][];
    private _userProgression: RaceProgression;
    private _lapDoneStream$: Subject<string>;
    private _raceDoneStream$: Subject<string>;

    public constructor() {
        this._playersProgression = [];
        this._lapDoneStream$ = new Subject();
        this._raceDoneStream$ = new Subject();
        this._userProgression = new RaceProgression();
    }

    public async initialize(carsPosition: [string, THREE.Vector3][], waypoints: [number, number, number][]): Promise<void> {
        return new Promise<void>( (resolve: Function, reject: Function) => {
            carsPosition.forEach( (carPosition: [string, THREE.Vector3]) => {
                if (carPosition[0] === USERNAME) {
                    this._userProgression = new RaceProgression(carPosition[1], waypoints);
                    this._playersProgression.push([carPosition[0], this._userProgression]);
                } else
                    this._playersProgression.push([carPosition[0], new RaceProgression(carPosition[1], waypoints)]);
            });
            this.initializeLapDoneStream();
            this.initializeRaceDoneStream();
            resolve();
        });
    }

    public update(): void {
        this._playersProgression.forEach((playerProgression: [string, RaceProgression]) => {
            if (playerProgression[1].nLap < MAX_N_LAPS)
                playerProgression[1].update();
        });
    }

    public get playersProgression(): [string, RaceProgression][] {
        return this._playersProgression;
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
        this._playersProgression.forEach((player) => {
            const playerProgression: RaceProgression = player[1];
            if (playerProgression.nLap > this.user.nLap)
                position++;
            else if (playerProgression.nLap === this.user.nLap) {
                if (playerProgression.nextWaypointIndex > this.user.nextWaypointIndex)
                    position++;
                else if (playerProgression.nextWaypointIndex === this.user.nextWaypointIndex) {
                    if (playerProgression.distanceToNextWaypoint() < this.user.distanceToNextWaypoint())
                        position++;
                }
            }

        });

        return position;
    }

    public isUserFirst(): boolean {
        return this.userPosition === 1;
    }

    public get unfinishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap < MAX_N_LAPS );
    }

    public get finishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap === MAX_N_LAPS );
    }

    public getPlayerProgression(playerName: string): RaceProgression {
        return this._playersProgression.find((player) => {
            return player[0] === playerName;
        })[1];
    }

    private initializeLapDoneStream(): void {
        this._playersProgression.forEach( (playerProgression: [string, RaceProgression]) => {
            playerProgression[1].lapDone$.subscribe( () => {
                this._lapDoneStream$.next(playerProgression[0]);
            });
        });
    }

    private initializeRaceDoneStream(): void {
        this._playersProgression.forEach( (playerProgression: [string, RaceProgression]) => {
            playerProgression[1].endOfRace$.subscribe( () => {
                this._raceDoneStream$.next(playerProgression[0]);
            });
        });
    }

}
