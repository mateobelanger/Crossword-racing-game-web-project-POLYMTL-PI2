import { Injectable } from '@angular/core';
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/itrackData";
import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
import { RaceResultsService } from "./recordedTimes/race-results.service";
import { Timer } from "./timer/timer";
import { RaceProgressionHandlerService } from './raceProgression/race-progression-handler.service';
import { CarHandlerService } from './cars/car-handler.service';
import { TrackLoaderService } from './track-loader.service';
import { EndGameService } from './end-game/end-game.service';
import { RaceProgression } from './raceProgression/raceProgression';
import { EndResultSimulator } from './simulateEndResults/endResultSimaltor';

@Injectable()
export class RaceDataHandlerService {

    private _uiLapTimer: Timer;
    private _totalTimeTimer: Timer;
    private _ITrackData: ITrackData;

    public constructor(private tracksProxyService: TracksProxyService,
                       private bestTimesService: BestTimeHandlerService,
                       private raceResultService: RaceResultsService,
                       private raceProgressionService: RaceProgressionHandlerService,
                       private carsHandlerService: CarHandlerService,
                       private trackLoaderService: TrackLoaderService,
                       private endGameService: EndGameService) {
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
        const finalWaypoints: [number, number, number][] = [];
        waypoints.forEach( (waypoint: [number, number, number]) => {
            finalWaypoints.push([waypoint[0], 0, waypoint[1]]);
        });

        return finalWaypoints;
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

    public doneRace(): void {
        this.stopTimers();
        this.simulateEndRaceResult();
        this.endGameService.endGame(this.raceProgressionService.isUserFirst());
    }

    // lap done from one player (ai or user)
    private doneLap(name: string): void {
        this.raceResultService.doneLap(name, this._totalTimeTimer.millisecondsElapsed);
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
            console.log("done lap niggu");
        });
    }

    private subscribeToEndOfRace(): void {
        this.raceProgressionService.user.endOfRace$.subscribe(() => {
            this.doneRace();
            console.log("done race niggu");
        });
    }

    private simulateEndRaceResult(): void {
        const endResultsSimulator: EndResultSimulator = new EndResultSimulator();
        endResultsSimulator.initialize(this._ITrackData.waypoints);

        console.log("unfinished player: ");
        console.log(this.raceProgressionService.unfinishedPlayers);

        this.raceProgressionService.unfinishedPlayers.forEach( (player: [string, RaceProgression]) => {
            for ( let i: number = 1; i <= player[1].remainingNLap; i++)
            this.raceResultService.doneLap( player[0],
                                            i * endResultsSimulator.
                                            simulatedTime(this.raceResultService.getPlayerRaceResults(player[0]).laps));
            console.log(this.raceResultService.raceFinalResults);
        });
    }

}
