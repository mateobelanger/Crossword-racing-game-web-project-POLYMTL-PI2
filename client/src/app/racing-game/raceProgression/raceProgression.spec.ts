import { RaceProgression } from "./raceProgression";
import * as THREE from "three";

// tslint:disable:no-magic-numbers
describe("RaceProgression", () => {

    let raceProgression: RaceProgression;
    const waypoints: [number, number, number][] = [
        [10, 10, 10], [40, 40, 40], [60, 60, 60], [80, 80, 80], [100, 100, 100]
    ];
    let carPosition: THREE.Vector3;

    beforeEach(() => {
        carPosition = new THREE.Vector3(0, 0, 0);
        raceProgression = new RaceProgression(carPosition, waypoints);
    });

    it("should increment waypoint", () => {
        carPosition.set(1, 1, 1);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(1);
    });

    it("should not increment waypoint", () => {
        carPosition.set(-100, 114, -21);
        raceProgression.update();
        expect(raceProgression.nextWaypointIndex).toEqual(1);
    });

    it("should increment nLap", () => {
        carPosition.set(10, 10, 10);
        raceProgression.update();
        carPosition.set(-100, -100, -100);
        raceProgression.update();
        carPosition.set(40, 40, 40);
        raceProgression.update();
        carPosition.set(-100, -100, -100);
        raceProgression.update();
        carPosition.set(60, 60, 60);
        raceProgression.update();
        carPosition.set(-100, -100, -100);
        raceProgression.update();
        carPosition.set(80, 80, 80);
        raceProgression.update();
        carPosition.set(-100, -100, -100);
        raceProgression.update();
        expect(raceProgression.nLap).toEqual(1);
    });

    it("distanceToNextWaypoint", () => {
        expect(raceProgression.distanceToNextWaypoint()).toEqual(Math.sqrt(300));
    });

    it("", () => {

    });

});
