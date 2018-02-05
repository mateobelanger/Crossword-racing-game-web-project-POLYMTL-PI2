import { Plane } from "./plane";
//import { Vector3, Mesh } from "three";

/* tslint:disable: no-magic-numbers */
describe("Plane", () => {



    it("should be instantiated correctly using default constructor", () => {
        const plane: Plane = new Plane();
        expect(plane).toBeDefined();
    });


});
