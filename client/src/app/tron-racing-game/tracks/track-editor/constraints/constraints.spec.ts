import * as THREE from "three";
import { Waypoint } from "../../../tracks/trackData/waypoint";
import { Constraints } from "./constraints";

const NUMBER_OF_WAYPOINTS: number = 10;

// tslint:disable:no-magic-numbers
describe("ConstraintsHandler", () => {

    let waypoints: Waypoint[] = [];
    let constraints: Constraints;
    let waypoint: Waypoint;

    beforeEach( () => {
        for (let i: number = 0; i < NUMBER_OF_WAYPOINTS ; i++) {
            waypoint = new Waypoint(new THREE.Vector3(i * NUMBER_OF_WAYPOINTS, 0, 0));
            waypoint.bindOutgoingPlane(i);
            waypoints.push(waypoint);
        }
        constraints = new Constraints();
        constraints.addRoads(waypoints);
        constraints.updateInvalidPlanes();
    });

    afterEach(() => {
        waypoints = [];
        constraints = null;
    });

    it("should be instantiated correctly when passing no parameters", () => {
        expect(constraints).toBeDefined();
    });

    it("should generate planes properly", () => {
        expect(constraints.invalidPlanesErrors.length).toEqual(9);
    });

    it("should remove planes properly", () => {
        constraints.removeRoad(waypoints[2].getIncomingPlaneId());
        constraints.updateInvalidPlanes();
        expect(constraints.invalidPlanesErrors.length).toEqual(8);
    });
});
