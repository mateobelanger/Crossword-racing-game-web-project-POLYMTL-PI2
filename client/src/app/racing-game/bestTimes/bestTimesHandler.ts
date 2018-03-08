const MAX_NB_BEST_TIMES: number = 5;

export class BestTimesHandler {

    public constructor( private _bestTimes: [string, number][] = [] ) {
    }

    public addTime( time: [string, number]): void {
        if (this._bestTimes.length < MAX_NB_BEST_TIMES)
            this._bestTimes.push(time);
        else if (time[1] < this._bestTimes[this.findWorstTimeIndex()][1]) {
            this._bestTimes[this.findWorstTimeIndex()] = time;
        }
    }

    public get bestTimes(): [string, number][] {
        return this._bestTimes.sort((time1, time2) => (time1[1] - time2[1]));
    }

    private findWorstTimeIndex(): number {
        let index: number = null;
        let maxTime: number = 0;
        this._bestTimes.forEach((element, i) => {
            if (element[1] > maxTime) {
                index = i;
                maxTime = element[1];
            }
        });

        return index;
    }

}
