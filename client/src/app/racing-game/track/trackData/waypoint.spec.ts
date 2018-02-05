import { Waypoint } from "./waypoint";
import {Vector3} from 'three';

/* tslint:disable: no-magic-numbers */
describe("Waypoint", () => {
    let waypoint: Waypoint ;

    beforeEach(() => {
        waypoint = new Waypoint( new Vector3(1, 2, 3));
    });

    afterEach(() => {
        waypoint = null;
    });

    it("should be instantiable using default constructor", () => {
        const aWaypoint: Waypoint = new Waypoint();
        expect(aWaypoint).toBeDefined();
    });

    it("should be instantiable using constructor with parameters", () => {
        const aWaypoint: Waypoint = new Waypoint( new Vector3(1, 1, 1));
        expect(aWaypoint).toBeDefined();
    });

    it("should getPosition", () => {
        expect(waypoint.getPosition().x).toBe(1);
        expect(waypoint.getPosition().y).toBe(2);
        expect(waypoint.getPosition().z).toBe(3);
    });

    it("should bind to a circle id with bindCircle", () => {
        waypoint.bindCircle(8);
        expect(waypoint.getCircleId()).toBe(8);
    });

    it("should unbindCircle", () => {
        waypoint.bindCircle(8);
        waypoint.unbindCircle();
        expect(waypoint.getCircleId()).toBe(null);
    });

    it("should not allow binding if already binded with bindCircle", () => {
        waypoint.bindCircle(8);
        waypoint.bindCircle(9);
        expect(waypoint.getCircleId()).toBe(8);
    });

    it("should accept 1 or 2 elements with bindPlanes", () => {
        waypoint.bindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([1]);
        waypoint.bindPlane(2);
        expect(waypoint.getPlanesIds()).toEqual([1, 2]);
    });

    it("should not accept more than 2 elements with bindPLanes", () => {
        waypoint.bindPlane(1);
        waypoint.bindPlane(2);
        waypoint.bindPlane(3);
        expect(waypoint.getPlanesIds()).toEqual([1, 2]);
    });


    it("should unbind plane with matching ids with unbindPlanes", () => {
        waypoint.bindPlane(1);
        waypoint.bindPlane(2);
        waypoint.unbindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([2]);
    });

    it("should refuse to have twice a plane id with bindPlanes", () => {
        waypoint.bindPlane(1);
        waypoint.bindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([1]);
    });
});
