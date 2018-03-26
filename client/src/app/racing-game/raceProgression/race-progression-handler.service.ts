import { Injectable } from '@angular/core';
import { RaceProgression } from './raceProgression';
import { UserRaceProgression} from "./userRaceProgression";
import { MAX_N_LAPS } from "../constants";
import { Subject } from 'rxjs/Subject';

const USERNAME: string = "user";
@Injectable()
export class RaceProgressionHandlerService {

    private _playersProgression: [string, RaceProgression][];
    private _userProgression: UserRaceProgression;
    private _lapDoneStream$: Subject<string>;

    public constructor() {
        this._playersProgression = [];
        this._lapDoneStream$ = new Subject();
        this._userProgression = new UserRaceProgression();
    }

    public initialize(carsPosition: [string, THREE.Vector3][], waypoints: [number, number, number][]): void {
        carsPosition.forEach( (carPosition: [string, THREE.Vector3]) => {
            if (carPosition[0] === USERNAME) {
                this._userProgression = new UserRaceProgression(carPosition[1], waypoints);
                this._playersProgression.push([carPosition[0], this._userProgression]);
            } else
                this._playersProgression.push([name, new RaceProgression(carPosition[1], waypoints)]);
        });
        this.initializeLapDoneStream();
    }

    public update(): void {
        this._playersProgression.forEach((playerProgression: [string, RaceProgression]) => {
            if (playerProgression[1].nLap < MAX_N_LAPS)
                playerProgression[1].update();
        });
    }

    public get lapDoneStream$(): Subject<string> {
        return this._lapDoneStream$;
    }
    public get user(): UserRaceProgression {
        return this._userProgression;
    }

    public get userPosition(): number {
        let position: number = 0;
        this._playersProgression.forEach((player) => {
            const playerProgression: RaceProgression = player[1];
            if (playerProgression.nLap > this.user.nLap)
                position++;
            else if (playerProgression.nLap === this.user.nLap) {
                if (playerProgression.nextWaypointIndex > this.user.nextWaypointIndex)
                    position++;
                else if (playerProgression.nextWaypointIndex === this.user.nextWaypointIndex) {
                    if (playerProgression.distanceToNextWaypoint() > this.user.distanceToNextWaypoint())
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

    private initializeLapDoneStream(): void {
        this._playersProgression.forEach( (playerProgression: [string, RaceProgression]) => {
            playerProgression[1].lapDone$.subscribe( () => {
                this._lapDoneStream$.next(playerProgression[0]);
            });
        });
    }

}
