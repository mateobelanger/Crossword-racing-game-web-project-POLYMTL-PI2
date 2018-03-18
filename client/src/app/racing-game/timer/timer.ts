const HUNDREDTHSECOND: number = 10;

export class Timer {

    private _id: number;
    private _hundrethSecondElapsed: number;

    public constructor() {
        this._hundrethSecondElapsed = 0;
    }

    public start(): void {
        this._id = window.setInterval(() => { this._hundrethSecondElapsed++; }, HUNDREDTHSECOND);
    }

    public reset(): void {
        this._hundrethSecondElapsed = 0;
    }

    public stop(): void {
        window.clearTimeout(this._id);
    }

    public get hundrethSecondElapsed(): number {
        return this._hundrethSecondElapsed;
    }
}
