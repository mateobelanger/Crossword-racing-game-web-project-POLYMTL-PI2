import { Injectable } from "@angular/core";
import { TracksProxyService } from "./../tracks/tracks-proxy.service";
import { ITrackData } from "../../../../../common/ITrackData";
import { BestTimeHandlerService } from "./recordedTimes/best-time-handler.service";
import { RaceResultsService } from "./recordedTimes/race-results.service";
import { RaceProgressionHandlerService } from "./raceProgression/race-progression-handler.service";
import { CarHandlerService } from "./../physics&interactions/cars/car-handler.service";
import { TrackLoaderService } from "../gameRendering/track-loader.service";
import { EndGameService } from "./end-game/end-game.service";
import { TimerHandler } from "./timer/timerHandler";
import { USERNAME, COUNTDOWN_TIME } from "../constants";
import { ResultsSimulatorService } from "./simulateEndResults/results-simulator.service";
import { Countdown } from "./timer/countdown";
import { AudioService } from "../audio/audio.service";
import { SpeedZonesService } from "../virtualPlayers/speed-zones.service";
import { VirtualPlayerDifficulty, BeginnerVirtualPlayer, ExpertVirtualPlayer } from "../virtualPlayers/virtualPlayerDifficulty";
import { PortalsHandlerService } from "../virtualPlayers/teleportation/portals-handler.service";
import * as THREE from "three";
import { CollisionHandlerService } from "../physics&interactions/collisions/collision-handler.service";
const COUNTDOWN_SOUND: string = "../../../assets/audio/RG/countdown.wav";
const RACE_START_SOUND: string = "../../../assets/audio/RG/start.wav";

@Injectable()
export class RaceDataHandlerService {

    private _timer: TimerHandler;
    private _countdown: Countdown;
    private _ITrackData: ITrackData;

    public constructor( private tracksProxyService: TracksProxyService,
                        private bestTimesService: BestTimeHandlerService,
                        private raceResultService: RaceResultsService,
                        private raceProgressionService: RaceProgressionHandlerService,
                        private carsHandlerService: CarHandlerService,
                        private endGameService: EndGameService,
                        private trackLoaderService: TrackLoaderService,
                        private resultsSimulatorService: ResultsSimulatorService,
                        private audioService: AudioService,
                        private speedZonesService: SpeedZonesService,
                        private portalHandlerService: PortalsHandlerService,
                        private collisionHandler: CollisionHandlerService) {

        this._timer = new TimerHandler();
        this._countdown = new Countdown();
        this._timer.reset();
    }

    public async initialize(trackname: string, choseEasyDifficulty: boolean): Promise<void> {
        try {
            const playerDifficulty: VirtualPlayerDifficulty = choseEasyDifficulty ? new BeginnerVirtualPlayer() : new ExpertVirtualPlayer();
            await this.tracksProxyService.initialize();

            this._ITrackData = this.tracksProxyService.findTrack(trackname);
            this.bestTimesService.bestTimes = this._ITrackData.bestTimes;
            this.trackLoaderService.points = this._ITrackData.waypoints;

            this.speedZonesService.initialize( playerDifficulty,
                                               this.castPointsToSceneWaypoints(this._ITrackData.waypoints) );

            await this.carsHandlerService.initialize( playerDifficulty );
            await this.raceProgressionService.initialize(   this.carsHandlerService.carsPosition,
                                                            this.castPointsToSceneWaypoints(this._ITrackData.waypoints) );

            this.carsHandlerService.moveCarsToStart(this.castPointsToSceneWaypoints(this._ITrackData.waypoints));
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

    public get lapElapsed(): number {
        return this.raceProgressionService.user.nLap;
    }

    public get totalTimeElapsed(): number {
        return this._timer.millisecondsElapsed;
    }

    public get uiTotalTimeElapsed(): number {
        return this._timer.uiMillisecondsElapsed;
    }
    public get uiLapTimeElapsed(): number {
        return this._timer.uiLapMillisecondsElapsed;
    }

    public get countdownTime(): number {
        return this._countdown.timeLeft;
    }

    public get position(): number {
        return this.raceProgressionService.userPosition;
    }

    public async startCountdown(): Promise<void> {
        this.audioService.playSound(COUNTDOWN_SOUND);
        this._countdown.start(COUNTDOWN_TIME).subscribe(
            () => {
                this.audioService.playSound(COUNTDOWN_SOUND);
            },
            (err: Error) => {
                console.error(err);
                this.carsHandlerService.enableControlKeys();
                this.carsHandlerService.startRace();
            },
            () => {
                this.audioService.playSound(RACE_START_SOUND);
                this.carsHandlerService.enableControlKeys();
                this.carsHandlerService.startRace();
            });
    }

    public startRace(): void {
        this._timer.reset();
        this._timer.start();
        this._ITrackData.timesPlayed++;
    }

    public doneRace(): void {
        this._timer.stop();
        this.carsHandlerService.endRace();
        this.simulateEndRaceResult();
        this.endGameService.endGame(this.raceProgressionService.isUserFirst())
            .subscribe(() => {
                this.updateITrackOnServer();
            });
    }

    public updateITrackOnServer(): void {
        this._ITrackData.bestTimes = this.bestTimesService.bestTimes;
        this.tracksProxyService.saveTrack(this._ITrackData)
                               .catch((error: Error) => { console.error(error); });
    }

    // lap done from one player (ai or user)
    private doneLap(name: string): void {
        this.raceResultService.doneLap(name, this._timer.millisecondsElapsed);
    }

    private subscribeToDoneLap(): void {
        this.raceProgressionService.lapDoneStream$.subscribe((name: string) => {
            this.doneLap(name);
            if (name === USERNAME) {
                this._timer.uiDoneLap();
            }
        });
    }

    private subscribeToEndOfRace(): void {
        this.raceProgressionService.raceDoneStream$.subscribe((name: string) => {
            if (name === USERNAME) {
                this.doneRace();
            } else {
                this.carsHandlerService.virtualPlayerFinished(name);
                this.collisionHandler.stopWatchingForCollision(this.carsHandlerService.getCar(name));
                this.portalHandlerService.teleport( this.carsHandlerService.getCar(name),
                                                    new THREE.Vector3(0, 0, 0))
                                         .catch((error: Error) => { console.error(error); });
            }
        });
    }

    private simulateEndRaceResult(): void {
        this.resultsSimulatorService.simulateEndResults(this._timer.millisecondsElapsed);
    }

}
