    import { Injectable } from '@angular/core';
    import { TracksProxyService } from "./tracks-proxy.service";
    import { ITrackData } from "../../../../common/trackData";
    import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
    import { RaceResultsService } from "./recordedTimes/race-results.service";
    import { Timer } from "./timer/timer";
    import { RaceProgressionHandlerService } from './raceProgression/race-progression-handler.service';
    import * as THREE from "three";
    import { PLAYERS_NAME } from "./constants";
    const USERNAME: string = "user";

    @Injectable()
    export class RaceDataHandlerService {

    private _uiLapTimer: Timer;
    private _totalTimeTimer: Timer;
    private _iTrackData: ITrackData;

    public constructor( private tracksProxyService: TracksProxyService,
                        private bestTimesService: BestTimeHandlerService,
                        private raceResultService: RaceResultsService,
                        private raceProgressionService: RaceProgressionHandlerService) {
    this._totalTimeTimer = new Timer();
    this._uiLapTimer = new Timer();
    this.resetValues();
    }

    public async initialize(trackname: string, carPosition: THREE.Vector3): Promise<void> {
        this.tracksProxyService.initialize()
        .then(() => {
            this._iTrackData = this.tracksProxyService.findTrack(trackname);
            this.bestTimesService.bestTimes = this._iTrackData.bestTimes;
            this.raceProgressionService.initialize(PLAYERS_NAME, carPosition, this._iTrackData.waypoints);
            this.raceResultService.initialize(PLAYERS_NAME);
            this.subscribeToDoneLap();
            this.subscribeToEndOfRace();
            })
        .catch((err) => {
            console.error("could not initialize race-data-handler");
            console.error(err);
        });
    }

    public update(): void {
        this.raceProgressionService.update();
    }

    public get lapElapsed(): number {
        return this.raceProgressionService.user.nLap;
    }

    public get totalTimeElapsed(): number {
        return this._totalTimeTimer.hundrethSecondElapsed;
    }

    public get lapTimeElapsed(): number {
        return this._uiLapTimer.hundrethSecondElapsed;
    }

    public get position(): number {
        return this.raceProgressionService.userPosition;
    }

    public startRace(): void {
        this.resetValues();
        this.startTimers();
    }

    // lap done from one player (ai or user)
    public doneLap(name: string): void {
        this.raceResultService.doneLap(name, this._totalTimeTimer.hundrethSecondElapsed);
    }

    public doneRace(): void {
        this.stopTimers();
        this.bestTimesService.addTime([USERNAME, this.raceResultService.getPlayerRaceResults(USERNAME).totalTime]);
    }


    private resetValues(): void {
        this._uiLapTimer.reset();
        this._totalTimeTimer.reset();
    }

    private startTimers(): void {
        this._uiLapTimer.start();
        this._totalTimeTimer.start();
    }

    private stopTimers(): void {
        this._uiLapTimer.stop();
        this._totalTimeTimer.stop();
    }

    private subscribeToDoneLap(): void {
            this.raceProgressionService.lapDoneStream$.subscribe( (name: string) => {
                this.doneLap(name);
            });
    }

    private subscribeToEndOfRace(): void {
        this.raceProgressionService.user.endOfRace$.subscribe( () => {
                this.doneRace();
            });
    }

}
