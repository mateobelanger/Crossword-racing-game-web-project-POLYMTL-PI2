import { Waypoint } from "..//trackData/waypoint";
import { Plane } from "./plane";
import * as THREE from 'three';

const CIRLEDIAMETER: number = 10;

/* tslint:disable: no-magic-numbers */
describe("Plane", () => {

    it("should be instantiated correctly using default constructor", () => {
        const plane: Plane = new Plane();
        expect(plane).toBeDefined();
    });

    it("should be instantiated correctly when passing parameters", () => {
        const beginingPoint: Waypoint = new Waypoint (new THREE.Vector3(0, 0, 0));
        const endPoint: Waypoint = new Waypoint (new THREE.Vector3(1, 1, 1));

        const plane: Plane = new Plane(beginingPoint, endPoint);
        expect(plane).toBeDefined();
        expect(plane.beginingPoint).toEqual(new THREE.Vector3(0, 0, -1));
        expect(plane.endPoint).toEqual(new THREE.Vector3(1, 1, -1));
        expect(plane.mesh).toBeNull();
        expect(plane.previousAngle).toEqual(0);
    });

    it("should calculate positive radian angle properly", () => {
        const beginingPoint: Waypoint = new Waypoint (new THREE.Vector3(0, 0, 0));
        const endPoint: Waypoint = new Waypoint (new THREE.Vector3(1, 1, 0));
        const plane: Plane = new Plane(beginingPoint, endPoint);
        expect(plane.calculateRadianAngle()).toBeCloseTo(Math.PI / 4);
    });

    it("should calculate negative radian angle properly", () => {
        const beginingPoint: Waypoint = new Waypoint (new THREE.Vector3(1, 1, 0));
        const endPoint: Waypoint = new Waypoint (new THREE.Vector3(0, 0, 0));
        const plane: Plane = new Plane(beginingPoint, endPoint);
        expect(plane.calculateRadianAngle()).toBeCloseTo(- (3 / 4) * Math.PI);
    });

    it("should calculate plane length properly", () => {
        const beginingPoint: Waypoint = new Waypoint (new THREE.Vector3(1, 1, 4));
        const endPoint: Waypoint = new Waypoint (new THREE.Vector3(4, 5, 0));
        const plane: Plane = new Plane(beginingPoint, endPoint);
        expect(plane.length).toEqual(5 - CIRLEDIAMETER);
    });

    it("should calculate center point properly", () => {
        const beginingPoint: Waypoint = new Waypoint (new THREE.Vector3(0, 0, 4));
        const endPoint: Waypoint = new Waypoint (new THREE.Vector3(4, 4, 0));
        const plane: Plane = new Plane(beginingPoint, endPoint);
        expect(plane.centerPoint).toEqual(new THREE.Vector3(2, 2, -1));
    });


});
