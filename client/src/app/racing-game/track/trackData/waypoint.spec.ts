import { Waypoint } from "./waypoint";
import {Vector3} from 'three';

describe("Waypoint", () =>{

    it("should be instantiable using default constructor",() =>{
        let waypoint: Waypoint = new Waypoint();
        expect(waypoint).toBeDefined();       
    });

    it("should be instantiable using constructor with parameters", () => {
        let waypoint: Waypoint = new Waypoint( new Vector3(1,1,1), 8);
        expect(waypoint).toBeDefined();
    });

    it("getPosition not working", () => {
        let waypoint: Waypoint = new Waypoint( new Vector3(1,2,3), 8);
        expect(waypoint.getPosition().x).toBe(1);
        expect(waypoint.getPosition().y).toBe(2);
        expect(waypoint.getPosition().z).toBe(3);
    });

    it("getId not working", () => {
        let waypoint: Waypoint = new Waypoint( new Vector3(1,1,1), 8);
        expect(waypoint.getId()).toBe(8);
    });

});