    import { Injectable } from '@angular/core';
    import { RaceProgression } from './raceProgression';
    import { UserRaceProgression} from "./userRaceProgression";
    import { MAX_N_LAPS } from "../constants";

    const USERNAME: string = "user";
    @Injectable()
    export class RaceProgressionHandlerService {

    private _playersProgression: [string, RaceProgression][];
    private _userProgression: UserRaceProgression;

    public constructor() {
        this._playersProgression = [];
    }

    public initialize(names: string[], carPosition: THREE.Vector3, waypoints: [number, number, number][]): void {
        names.forEach( (name: string) => {
            if (name === USERNAME) {
                this._userProgression = new UserRaceProgression(carPosition, waypoints);
                this._playersProgression.push([name, this._userProgression]);
            } else
                this._playersProgression.push([name, new RaceProgression(carPosition, waypoints)]);
        });
    }

    public update(): void {
        this._playersProgression.forEach((playerProgression: [string, RaceProgression]) => {
            if (playerProgression[1].nLap < MAX_N_LAPS)
                playerProgression[1].update();
        });
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

    public get unfinishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap < MAX_N_LAPS );
    }

    public get finishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap === MAX_N_LAPS );
    }

}
