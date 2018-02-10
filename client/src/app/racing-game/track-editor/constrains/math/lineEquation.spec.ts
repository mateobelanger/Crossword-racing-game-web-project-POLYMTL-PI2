import { LineEquation } from "./lineEquation";
import { Point } from "./point";
import * as THREE from "three";
/*tslint:disable:no-magic-numbers*/
describe("lineEquation", () => {
    const firstPoint: Point = new Point(new THREE.Vector3(-5, 4, 10));
    const secondPoint: Point  = new Point(new THREE.Vector3(11, 6, 10));
    const line: LineEquation = new LineEquation();
    line.initialize(firstPoint, secondPoint);


    it("should be instanciable with default constructor", () => {
        expect(line).toBeDefined();
    });
    it("get lower bound", () => {
        expect(line.lowerBound).toBe(-5);
    });
    it("get higher bound", () => {
        expect(line.higherBound).toBe(11);
    });
    it("get slope", () => {
        expect(line.slope).toBe(1 / 8);
    });
    it("get b", () => {
        expect(line.b).toBe(4.625);
    });
    it("isVerticaLine with regular line", () => {
        expect(line.isVerticalLine).not.toBeTruthy();
    });
    it("isVerticaLine with vertical line (not a function)", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(0, 4, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(0, 6, 10));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        expect(aLine.isVerticalLine).toBeTruthy();
    });

});

