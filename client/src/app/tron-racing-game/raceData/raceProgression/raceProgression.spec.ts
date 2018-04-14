import { RaceProgression } from "./raceProgression";
import * as THREE from "three";


// tslint:disable:no-magic-numbers
describe("RaceProgression", () => {

    // tslint:disable-next-line
    function fullLap(carPosition: THREE.Vector3): void {
        carPosition.set(10, 0, 10);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(1);
        carPosition.set(40, 0, 40);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(2);
        carPosition.set(60, 0, 60);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(3);
        carPosition.set(80, 0, 80);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(4);
        carPosition.set(100, 0, 100);
        raceProgression.update();
        carPosition.set(10, 0, 10);
        raceProgression.update();
    }

    let raceProgression: RaceProgression;
    const waypoints: [number, number, number][] = [
        [10, 0, 10], [40, 0, 40], [60, 0, 60], [80, 0, 80], [100, 0, 100]
    ];
    let carPosition: THREE.Vector3;

    beforeEach(() => {
        carPosition = new THREE.Vector3(0, 0, 0);
        raceProgression = new RaceProgression(carPosition, waypoints);
    });

    it("should increment waypoint", () => {
        carPosition.set(40, 0, 40);
        raceProgression.update();
        expect(raceProgression.currentWaypointIndex).toEqual(1);
        carPosition.set(60, 0, 60);
        raceProgression.update();
        expect(raceProgression.currentWaypointIndex).toEqual(2);
    });

    it("should not increment waypoint", () => {
        carPosition.set(-100, 0, -21);
        raceProgression.update();
        expect(raceProgression.currentWaypointIndex).toEqual(0);
    });

    it("should increment nLap", () => {
        fullLap(carPosition);
        expect(raceProgression.nLap).toEqual(1);
    });

    it("distanceToNextWaypoint", () => {
        expect(raceProgression.distanceToNextWaypoint()).toEqual(Math.sqrt(3200));
    });

    // TODO: enlever
//     it("", () => {

//     });

});
