import { Waypoint } from "./waypoint";
import {Vector3} from 'three';

describe("Waypoint", () =>{
    let waypoint: Waypoint ;

    beforeEach(()=> {
        waypoint = new Waypoint( new Vector3(1,2,3));
    });

    afterEach(() => {
        waypoint= null;
    });

    it("should be instantiable using default constructor",() =>{
        let aWaypoint: Waypoint = new Waypoint();
        expect(aWaypoint).toBeDefined();       
    });

    it("should be instantiable using constructor with parameters", () => {
        let aWaypoint: Waypoint = new Waypoint( new Vector3(1,1,1));
        expect(aWaypoint).toBeDefined();
    });

    it("getPosition", () => {        
        expect(waypoint.getPosition().x).toBe(1);
        expect(waypoint.getPosition().y).toBe(2);
        expect(waypoint.getPosition().z).toBe(3);
    });

    it("bindCircle should bind to a circle id", () => {
        waypoint.bindCircle(8);
        expect(waypoint.getCircleId()).toBe(8);
    });

    it("unbindCircle", () => {
        waypoint.bindCircle(8);
        waypoint.unbindCircle();
        expect(waypoint.getCircleId()).toBe(null);
    });

    it("bindCircle should not allow binding if already binded", () => {
        waypoint.bindCircle(8);
        waypoint.bindCircle(9);
        expect(waypoint.getCircleId()).toBe(8);
    });

    it("bindPlanes should accept 1 or 2 elements", () => {
        waypoint.bindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([1]);
        waypoint.bindPlane(2);
        expect(waypoint.getPlanesIds()).toEqual([1,2]);
    });

    it("bindPLanes should not accept more than 2 elements", ()=>{
        waypoint.bindPlane(1);
        waypoint.bindPlane(2);
        waypoint.bindPlane(3);
        expect(waypoint.getPlanesIds()).toEqual([1,2]);
    });


    it("unbindPlanes should unbind plane with matching ids",() => {
        waypoint.bindPlane(1);
        waypoint.bindPlane(2);
        waypoint.unbindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([2]);
    });

    it("bindPlanes should refuse to have twice a plane id",() => {
        waypoint.bindPlane(1);
        waypoint.bindPlane(1);
        expect(waypoint.getPlanesIds()).toEqual([1]);
    });
});