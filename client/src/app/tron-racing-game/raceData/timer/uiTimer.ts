const MILLISECONDS_TO_HUNDRETH_SECONDS: number = 10;

export class UiTimer {
    private _id: number;
    private _time: number;
    public constructor() {
        this._time = 0;
    }

    public get millisecondsElapsed(): number {
        return this._time;
    }

    public start(): void {
        this._id = window.setTimeout( () => { this._time++; }, MILLISECONDS_TO_HUNDRETH_SECONDS);
    }

    public stop(): void {
        window.clearTimeout(this._id);
    }

    public reset(): void {
        this._time = 0;
    }

}
