import { Injectable } from '@angular/core';
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/itrackData";
import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
import { RaceResultsService } from "./recordedTimes/race-results.service";
import { Timer } from "./timer/timer";
import { RaceProgressionHandlerService } from './raceProgression/race-progression-handler.service';
import { CarHandlerService } from './cars/car-handler.service';
import { TrackLoaderService } from './track-loader.service';
const USERNAME: string = "user";


@Injectable()
export class RaceDataHandlerService {

    private _uiLapTimer: Timer;
    private _totalTimeTimer: Timer;
    private _ITrackData: ITrackData;

    public constructor(private tracksProxyService: TracksProxyService,
                       private bestTimesService: BestTimeHandlerService,
                       private raceResultService: RaceResultsService,
                       private _raceProgressionService: RaceProgressionHandlerService,
                       private _carsHandlerService: CarHandlerService,
                       private trackLoaderService: TrackLoaderService) {
        this._totalTimeTimer = new Timer();
        this._uiLapTimer = new Timer();
        this.resetValues();
    }


    public async initialize(trackname: string): Promise<void> {
        try {
            await this.tracksProxyService.initialize();

            this._ITrackData = this.tracksProxyService.findTrack(trackname);
            this.bestTimesService.bestTimes = this._ITrackData.bestTimes;
            this.trackLoaderService.points = this._ITrackData.waypoints;

            await this.carsHandlerService.initialize();
            this.carsHandlerService.moveCarsToStart(this.castPointsToSceneWaypoints(this._ITrackData.waypoints));

            this.raceProgressionService.initialize(this.carsHandlerService.carsPosition,
                                                   this.castPointsToSceneWaypoints(this._ITrackData.waypoints));
            this.raceResultService.initialize();
            this.subscribeToDoneLap();
            this.subscribeToEndOfRace();
        } catch (err) {
            console.error("could not initialize race-data-handler");
            console.error(err);
        }
    }

    // Invert x/z coordinates to fit the actual scene
    private castPointsToSceneWaypoints(waypoints: [number, number, number][]): [number, number, number][] {
        const finalWaypoints: [number, number, number][] = new Array<[number, number, number]>();

        for ( let i: number = 0; i < waypoints.length - 1; i++)
            finalWaypoints.push([waypoints[i][0], 0, waypoints[i][1]]);

        return finalWaypoints;
    }

    public update(): void {
        this._raceProgressionService.update();
    }

    public get raceProgressionService(): RaceProgressionHandlerService {
        return this._raceProgressionService;
    }

    public get carsHandlerService(): CarHandlerService {
        return this._carsHandlerService;
    }

    public get lapElapsed(): number {
        return this._raceProgressionService.user.nLap;
    }

    public get totalTimeElapsed(): number {
        return this._totalTimeTimer.millisecondsElapsed;
    }

    public get lapTimeElapsed(): number {
        return this._uiLapTimer.millisecondsElapsed;
    }

    public get position(): number {
        return this._raceProgressionService.userPosition;
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
        this.raceProgressionService.lapDoneStream$.subscribe((name: string) => {
            this.doneLap(name);
        });
    }

    private subscribeToEndOfRace(): void {
        this.raceProgressionService.user.endOfRace$.subscribe(() => {
            this.doneRace();
        });
    }

}
