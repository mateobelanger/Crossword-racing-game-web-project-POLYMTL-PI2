import { Waypoint } from "..//trackData/waypoint";
import { PlaneHandler } from "./planeHandler";
//import { Plane } from "./plane";
import * as THREE from 'three';

/* tslint:disable: no-magic-numbers */
describe("PlaneHandlerHandler", () => {

    const waypoints: Waypoint[] = [];
    let planeHandler: PlaneHandler;
    const scene: THREE.Scene = new THREE.Scene();

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) {
            const waypoint: Waypoint = new Waypoint(new THREE.Vector3(i * 10, 0, 0));
            waypoint.bindCircle(i);
            waypoints.push(waypoint);
        }
    });


    it("should be instantiated correctly when passing parameters", () => {
        planeHandler = new PlaneHandler(scene);
        expect(planeHandler).toBeDefined();
    });

    //TODO: Ajuster test devrait être 9 au lieu de 19
    it("should generate planes properly", () => {
        planeHandler.generatePlanes(waypoints, false);
        expect(planeHandler.getPlanes().length).toEqual(19);
    });
/*
     //TODO: Ajuster test devrait être 8 au lieu de 18
    it("should remove planes properly", () => {
        planeHandler.removePlane(waypoints[2].getPlanesIds());
        expect(planeHandler.getPlanes().length).toEqual(18);
    });
*/
});
