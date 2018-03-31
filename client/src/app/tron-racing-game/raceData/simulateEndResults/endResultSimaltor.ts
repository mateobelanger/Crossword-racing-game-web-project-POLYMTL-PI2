const AVERAGE_SPEED_PER_SECOND: number = 0.5;

export class EndResultSimulator {

    private _trackSize: number;
    public constructor() {
        this._trackSize = 0;
    }

    public initialize(waypoints: [number, number, number][]): void {
        this._trackSize = 0;
        waypoints.forEach( (waypoint: [number, number, number]) => {
            this._trackSize += this.length(waypoint);
        });
    }

    public simulatedTime(times: number[]): number {
        if ( times.length === 0) {
            return this._trackSize / AVERAGE_SPEED_PER_SECOND;
        } else {
            return this.averageTime(times);
        }
    }

    private length(waypoint: [number, number, number]): number {
        return Math.sqrt(Math.pow( waypoint[0], 2) + Math.pow( waypoint[0], 2) + Math.pow( waypoint[0], 2));
    }

    private averageTime( times: number[]): number {
        let totalTime: number = 0;
        totalTime = times.reduce( (accumulator: number, time: number) => accumulator + time);

        return totalTime / times.length;
    }
}
