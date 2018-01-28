import { WayPoint } from "./wayPoint";
import {Vector3} from 'three';

describe("WayPoint", () =>{

    it("should be instantiable using default constructor",() =>{
        let wayPoint: WayPoint = new WayPoint();
        expect(wayPoint).toBeDefined();       
    });

    it("should be instantiable using constructor with parameters", () => {
        let wayPoint: WayPoint = new WayPoint( new Vector3(1,1,1), 8);
        expect(wayPoint).toBeDefined();
    });

    it("getPosition not working", () => {
        let wayPoint: WayPoint = new WayPoint( new Vector3(1,2,3), 8);
        expect(wayPoint.getPosition().x).toBe(1);
        expect(wayPoint.getPosition().y).toBe(2);
        expect(wayPoint.getPosition().z).toBe(3);
    });

    it("getId not working", () => {
        let wayPoint: WayPoint = new WayPoint( new Vector3(1,1,1), 8);
        expect(wayPoint.getId()).toBe(8);
    });

});