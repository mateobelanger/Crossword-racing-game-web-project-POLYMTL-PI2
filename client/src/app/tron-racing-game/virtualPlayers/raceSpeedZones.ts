import { TrackSegmentSpeed } from "./trackSegmentSpeed";
import { VirtualPlayerDifficulty } from "./virtualPlayerDifficulty";
import * as THREE from "three";
// import { VIRTUAL_PLAYER_SKILL } from "../constants";
const PI: number = 3.14;
export class RaceSpeedZones {

    private speedZones: TrackSegmentSpeed[];
    public constructor() {
    }

    // TODO: create indexSpeddZone and update it when signal reached waypoint
    // TODO: get speed changes from tracks segment and in corner

    public initialize(playerSkill: VirtualPlayerDifficulty, waypoints: [number, number, number][]): void {
        waypoints.forEach( (waypoint: [number, number, number], index: number) => {
            const angle: number = this.calculateRadianAngle(waypoint,
                                                            waypoints[(index + 1) % waypoints.length],
                                                            waypoints[(index + 2) % waypoints.length]);
            this.speedZones.push(this.createTrackSpeedZone(playerSkill, angle));
        });
    }

    private calculateRadianAngle(   firstWaypoint: [number, number, number],
                                    secondWaypoint: [number, number, number],
                                    thirdWaypoint: [number, number, number]): number {
        const firstTrackDirection: THREE.Vector3 = this.waypointsToVector(firstWaypoint, secondWaypoint);
        const secondTrackDirection: THREE.Vector3 = this.waypointsToVector(secondWaypoint, thirdWaypoint);

        let angle: number = secondTrackDirection.angleTo(firstTrackDirection);
        if ( Math.sign(firstTrackDirection.x) !== Math.sign(secondTrackDirection.x)) {
            angle = PI - angle;
        }

        return angle;
    }

    private waypointsToVector(  firstWaypoint: [number, number, number],
                                secondWaypoint: [number, number, number]): THREE.Vector3 {
            return new THREE.Vector3(
            secondWaypoint[0] - firstWaypoint[0],
            secondWaypoint[1] - firstWaypoint[1],
            secondWaypoint[2] - firstWaypoint[2]
        );
    }

    private createTrackSpeedZone(playerSkill: VirtualPlayerDifficulty, angle: number): TrackSegmentSpeed {
        return {cornerSpeed: playerSkill.cornerSpeed * this.cornerSlowDownFactor(angle),
                defaultSpeed: playerSkill.defaultSpeed * this.cornerSlowDownFactor(angle)};
    }

    private cornerSlowDownFactor(angle: number): number {
        return (PI - angle) / PI;
    }
}
