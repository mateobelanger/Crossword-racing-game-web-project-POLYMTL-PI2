const MILLISECONDS_TO_HUNDRETH_SECONDS: number = 10;

export class UiTimer {
    private _id: number;
    private _totalTime: number;
    private _lapTime: number;
    public constructor() {
        this._totalTime = 0;
    }

    public get millisecondsElapsed(): number {
        return this._totalTime;
    }

    public get lapMillisecondsElapsed(): number {
        return this._lapTime;
    }

    public start(): void {
        this._id = window.setInterval( () => { this._totalTime++; this._lapTime++; }, MILLISECONDS_TO_HUNDRETH_SECONDS);
    }

    public stop(): void {
        window.clearInterval(this._id);
    }

    public reset(): void {
        this._totalTime = 0;
        this._lapTime = 0;
    }

    public lap(): void {
        this._lapTime = 0;
    }

}
