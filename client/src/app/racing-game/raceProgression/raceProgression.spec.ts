// import { RaceProgression } from "./raceProgression";
// import * as THREE from "three";


// // tslint:disable:no-magic-numbers
// describe("RaceProgression", () => {

//     // tslint:disable-next-line
//     function fullLap(): void {
//         carPosition.set(10, 10, 10);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(1);
//         carPosition.set(40, 40, 40);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(2);
//         carPosition.set(60, 60, 60);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(3);
//         carPosition.set(80, 80, 80);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(4);
//         carPosition.set(100, 100, 100);
//         raceProgression.update();
//     }

//     let raceProgression: RaceProgression;
//     const waypoints: [number, number, number][] = [
//         [10, 10, 10], [40, 40, 40], [60, 60, 60], [80, 80, 80], [100, 100, 100]
//     ];
//     let carPosition: THREE.Vector3;

//     beforeEach(() => {
//         carPosition = new THREE.Vector3(0, 0, 0);
//         raceProgression = new RaceProgression(carPosition, waypoints);
//     });

//     it("should increment waypoint", () => {
//         carPosition.set(9, 9, 10);
//         raceProgression.update();
//         carPosition.set(20, 20, 20);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(1);
//     });

//     it("should not increment waypoint", () => {
//         carPosition.set(-100, 114, -21);
//         raceProgression.update();
//         expect(raceProgression.nextWaypointIndex).toEqual(0);
//     });

//     it("should increment nLap", () => {
//         fullLap();
//         expect(raceProgression.nLap).toEqual(1);
//     });

//     it("distanceToNextWaypoint", () => {
//         expect(raceProgression.distanceToNextWaypoint()).toEqual(Math.sqrt(300));
//     });

//     it("", () => {

//     });

// });
