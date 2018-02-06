import { Waypoint } from "..//trackData/waypoint";
import { PlaneHandler } from "./planeHandler";
import * as THREE from 'three';

/* tslint:disable: no-magic-numbers */
describe("PlaneHandlerHandler", () => {

    let waypoints: Waypoint[] = [];
    let planeHandler: PlaneHandler;
    const scene: THREE.Scene = new THREE.Scene();

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) {
            const waypoint: Waypoint = new Waypoint(new THREE.Vector3(i * 10, 0, 0));
            waypoint.bindCircle(i);
            waypoints.push(waypoint);
        }
        planeHandler = new PlaneHandler(scene);
    });

    afterEach(() => {
        waypoints = [];
        planeHandler = null;
    });


    it("should be instantiated correctly when passing parameters", () => {
        expect(planeHandler).toBeDefined();
    });

    it("should generate planes properly", () => {
        planeHandler.generatePlanes(waypoints);
        expect(planeHandler.getPlanes().length).toEqual(9);
    });

    it("should remove planes properly", () => {
        planeHandler.removePlane(waypoints[2].getIncomingPlaneId());
        expect(planeHandler.getPlanes().length).toEqual(18);
    });


});
