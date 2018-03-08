import { ITrackData } from "../../../../../common/trackData";

const MAX_NB_BEST_TIMES: number = 5;

export class BestTimesHandler {

    public constructor( private _bestTimes: number[] = [] ) {
    }

    public addTime( time: number): void {
        if (this._bestTimes.length < MAX_NB_BEST_TIMES)
            this._bestTimes.push(time);
        else {
            const worstBestTime: number = Math.max(...this._bestTimes);
            if (time < worstBestTime)
                this._bestTimes[this.findIndex(worstBestTime)] = time;
        }
    }

    public get bestTimes(): number[] {
        return this._bestTimes;
    }

    private findIndex(time: number): number {
        let index: number = null;
        this._bestTimes.forEach((element, i) => {
            if (element === time)
                index = i;
        });

        return index;
    }

}
