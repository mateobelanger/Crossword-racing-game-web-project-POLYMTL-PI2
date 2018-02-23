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
        expect(waypoint.position.x).toBe(1);
        expect(waypoint.position.y).toBe(2);
        expect(waypoint.position.z).toBe(3);
    });

    it("should bind to a circle id with bindCircle", () => {
        waypoint.bindCircle(8);
        expect(waypoint.circleId).toBe(8);
    });

    it("should unbindCircle", () => {
        waypoint.bindCircle(8);
        waypoint.unbindCircle();
        expect(waypoint.circleId).toBe(null);
    });

    it("should not allow binding if already binded with bindCircle", () => {
        waypoint.bindCircle(8);
        waypoint.bindCircle(9);
        expect(waypoint.circleId).toBe(8);
    });

    it("bindIncomingPlane", () => {
        waypoint.bindIncomingPlane(9);
        expect(waypoint.getIncomingPlaneId()).toBe(9);
    });

    it("unbindIncomingPlane", () => {
        waypoint.bindIncomingPlane(9);
        waypoint.unbindIncomingPlane();
        expect(waypoint.getIncomingPlaneId()).toBeNull();
    });

    it("bindOutgoingPlane", () => {
        waypoint.bindOutgoingPlane(9);
        expect(waypoint.getOutgoingPlaneId()).toBe(9);
    });

    it("unbindOutcomingPlane", () => {
        waypoint.bindOutgoingPlane(9);
        waypoint.unbindOutgoingPlane();
        expect(waypoint.getOutgoingPlaneId()).toBeNull();
    });

});
