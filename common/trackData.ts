export interface TrackData {
    name: string,
    description: string,
    timesPlayed: number,
    bestTimes:[string, number][],
    waypoints:[number, number, number][]
}