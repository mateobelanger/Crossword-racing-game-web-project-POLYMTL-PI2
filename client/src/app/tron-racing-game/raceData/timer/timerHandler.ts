import { Timer } from "./timer";
import { UiTimer } from "./uiTimer";

export class TimerHandler {

    private _dataTimer: Timer;
    private _uiTimer: UiTimer;

    public constructor() {
        this._dataTimer = new Timer();
        this._uiTimer = new UiTimer();
    }

    public get millisecondsElapsed(): number {
        return this._dataTimer.millisecondsElapsed;
    }
    public get uiMillisecondsElapsed(): number {
        return this._uiTimer.millisecondsElapsed;
    }

    public get uiLapMillisecondsElapsed(): number {
        return this._uiTimer.lapMillisecondsElapsed;
    }

    public start(): void {
        this._dataTimer.start();
        this._uiTimer.start();
    }

    public stop(): void {
        this._dataTimer.stop();
        this._uiTimer.stop();
    }

    public reset(): void {
        this._dataTimer.reset();
        this._uiTimer.reset();
    }

    public uiDoneLap(): void {
        this._uiTimer.lap();
    }

}
