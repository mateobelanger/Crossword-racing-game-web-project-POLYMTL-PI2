import { Waypoint } from "../../tracks/trackData/waypoint";
import { CircleHandler } from "./circleHandler";
import * as THREE from "three";

/* tslint:disable: no-magic-numbers */
describe("CircleHandler", () => {

    let waypoints: Waypoint[] = [];
    let circleHandler: CircleHandler;
    const scene: THREE.Scene = new THREE.Scene();

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) {
            const waypoint: Waypoint = new Waypoint(new THREE.Vector3(i * 10, 0, 0));
            waypoint.bindCircle(i);
            waypoints.push(waypoint);
        }
        circleHandler = new CircleHandler(scene);
        circleHandler.generateCircles(waypoints, false);
    });

    afterEach(() => {
        waypoints = [];
        circleHandler = null;
    });

    it("should be instantiated correctly when passing parameters", () => {
        expect(circleHandler).toBeDefined();
    });

    it("should generate circles properly", () => {
        expect(circleHandler.getCircles().length).toEqual(10);
    });

    it("should remove circles properly", () => {
        circleHandler.removeCircle(waypoints[2].circleId);
        expect(circleHandler.getCircles().length).toEqual(9);
    });

});
