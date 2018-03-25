    import { Injectable } from '@angular/core';
    import { TracksProxyService } from "./tracks-proxy.service";
    import { ITrackData } from "../../../../common/trackData";
    import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
    import { RaceResultsService } from "./recordedTimes/race-results.service";
    import { Timer } from "./timer/timer";
    import { RaceProgressionHandlerService } from './raceProgression/race-progression-handler.service';
    import { CarHandlerService } from './cars/car-handler.service';
    const USERNAME: string = "user";
import { TrackLoaderService } from './track-loader.service';

    @Injectable()
    export class RaceDataHandlerService {

    private _uiLapTimer: Timer;
    private _totalTimeTimer: Timer;
    private _ITrackData: ITrackData;
        private trackLoaderService: TrackLoaderService) {

    public constructor( private tracksProxyService: TracksProxyService,
                        private bestTimesService: BestTimeHandlerService,
                        private raceResultService: RaceResultsService,
                        private raceProgressionService: RaceProgressionHandlerService,
                        private carsHandlerService: CarHandlerService) {
        this._totalTimeTimer = new Timer();
        this._uiLapTimer = new Timer();
        this.resetValues();
    }
                this.trackLoaderService.points = this._iTrackData.waypoints;

    public async initialize(trackname: string): Promise<void> {
        try {
            await this.tracksProxyService.initialize();
            this._ITrackData = this.tracksProxyService.findTrack(trackname);
            this.bestTimesService.bestTimes = this._ITrackData.bestTimes;
            await this.carsHandlerService.initialize();
            this.raceProgressionService.initialize(this.carsHandlerService.carsPosition, this._ITrackData.waypoints);
            this.raceResultService.initialize();
            this.subscribeToDoneLap();
            this.subscribeToEndOfRace();
        } catch (err) {
            console.error("could not initialize race-data-handler");
            console.error(err);
        }
    }

    public update(): void {
        this.raceProgressionService.update();
    }

    public get lapElapsed(): number {
        return this.raceProgressionService.user.nLap;
    }

    public get totalTimeElapsed(): number {
        return this._totalTimeTimer.millisecondsElapsed;
    }

    public get lapTimeElapsed(): number {
        return this._uiLapTimer.millisecondsElapsed;
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
        this.raceResultService.doneLap(name, this._totalTimeTimer.millisecondsElapsed);
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
