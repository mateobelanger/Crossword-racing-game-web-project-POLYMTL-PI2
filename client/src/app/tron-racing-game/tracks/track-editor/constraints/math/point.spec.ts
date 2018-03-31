// tslint:disable:no-magic-numbers
import * as THREE from "three";
import { Point } from "./point";

describe("point", () => {
    let point: Point;
    beforeEach(() => {
        point = new Point( new THREE.Vector3(8, 1, 87));
    });

    afterEach(() => {
        point = null;
    });

    it("should be instanciable using default constructor", () => {
        const aPoint: Point = new Point();
        expect(aPoint).toBeDefined();
    });
    it("should be instanciable using constructor with parameters", () => {
        expect(point).toBeDefined();
    });
    it("should get x attribute with getter", () => {
        expect(point.x).toBe(8);
    });
    it("should get y attribute with getter", () => {
        expect(point.y).toBe(1);
    });
});
