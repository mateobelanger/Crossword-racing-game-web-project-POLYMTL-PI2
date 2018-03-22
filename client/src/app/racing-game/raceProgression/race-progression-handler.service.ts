    import { Injectable } from '@angular/core';
    import { RaceProgression } from './raceProgression';
    const MAX_N_LAPS: number = 3;

    @Injectable()
    export class RaceProgressionHandlerService {

    private _playersProgression: [string, RaceProgression][];

    public constructor() {
        this._playersProgression = [];
    }

    public initialize(names: string[], carPosition: THREE.Vector3, waypoints: [number, number, number][]): void {
        names.forEach( (name: string) => {
            this._playersProgression.push([name, new RaceProgression(carPosition, waypoints)]);
        });
    }

    public update(): void {
        this._playersProgression.forEach((playerProgression: [string, RaceProgression]) => {
            if (playerProgression[1].nLap < MAX_N_LAPS)
                playerProgression[1].update();
        });
    }

    public get unfinishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap < MAX_N_LAPS );
    }

    public get finishedPlayers(): [string, RaceProgression][] {
        return this._playersProgression.filter( (playerProgression) => playerProgression[1].nLap === MAX_N_LAPS );
    }

}
