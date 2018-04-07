import { Subject } from "rxjs/Subject";

const MILLISECONDS_TO_TWO_SECONDS: number = 1000;
export class Countdown {

    private _secondDoneStream$: Subject<void>;
    private _timeLeft: number;


    public constructor() {
        this._secondDoneStream$ = new Subject();
        this._timeLeft = 0;
    }

    public start(time: number): Subject<void> {
        this._timeLeft = time;
        const id: number = window.setInterval(() => {
            this._timeLeft--;
            if ( this._timeLeft > 0) {
                this._secondDoneStream$.next();
            } else {
                this._secondDoneStream$.complete();
                window.clearInterval(id);
            }
        },                                    MILLISECONDS_TO_TWO_SECONDS);

        return this._secondDoneStream$;
    }

    public get timeLeft(): number {
        return this._timeLeft;
    }

}
