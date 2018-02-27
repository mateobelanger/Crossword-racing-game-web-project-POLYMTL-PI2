export interface ITrackData {
    name: string;
    description: string;
    timesPlayed: number;
    bestTimes:[string, number][];
    waypoints:[number, number, number][];
}
