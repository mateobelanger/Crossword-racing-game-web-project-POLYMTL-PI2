import { Subject } from "rxjs/Subject";

const MILLISECONDS_TO_SECONDS: number = 1000;
export class Countdown {

    private _secondDoneStream$: Subject<void>;
    private _secondsLeft: number;
    private _totalTime: number;
    private _beginTime: number;

    public constructor() {
        this._secondDoneStream$ = new Subject();
        this._secondsLeft = 0;
    }

    public start(time: number): Subject<void> {
        this._totalTime = time;
        this._beginTime = Date.now();

        return this._secondDoneStream$;
    }

    public get secondsLeft(): number {
        this.updateSecondsLeft();

        return this.secondsLeft;
    }

    public get secondsElapsed(): number {
        return Date.now() - this._beginTime;
    }

    private updateSecondsLeft(): void {
        const time: number = Math.ceil( (this._totalTime - this.secondsElapsed) / MILLISECONDS_TO_SECONDS );
        if ( time !== this._secondsLeft) {
            this._secondsLeft = time;
            this._secondDoneStream$.next();
        }
    }
}
