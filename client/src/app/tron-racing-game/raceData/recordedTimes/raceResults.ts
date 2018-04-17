const MAX_NB_LAPS: number = 3;

export class RaceResults {
    private _laps: number[];

    public constructor() {
        this._laps = [];
    }

    public get laps(): number[] {
        return this._laps;
    }

    public get totalTime(): number {
        return this.calculateTotalTime();
    }

    public doneLap(time: number): void {
        if (this._laps.length < MAX_NB_LAPS) {
            this._laps.push(time - this.calculateTotalTime());
        }
    }

    public calculateTotalTime(): number {
        return this._laps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }
}
