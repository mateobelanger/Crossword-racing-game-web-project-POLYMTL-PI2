export class Timer {

    private _beginTime: number;
    private _pausedTime: number;
    private _stopped: boolean;

    public constructor() {
        this._pausedTime = 0;
        this._stopped = false;
    }

    public start(): void {
        this._beginTime = Date.now();
        this._stopped = false;
    }

    public stop(): void {
        this._pausedTime = this.millisecondsElapsed;
    }

    public reset(): void {
        this._pausedTime = 0;
        this._stopped = true;
    }

    public get millisecondsElapsed(): number {
        return this._stopped ? this._pausedTime : Date.now() - this._beginTime + this._pausedTime;
    }
}
