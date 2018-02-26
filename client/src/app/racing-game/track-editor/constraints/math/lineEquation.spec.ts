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
        const aline: LineEquation = new LineEquation();
        expect(aline).toBeDefined();
    });

    it("should be instanciable with constructor with parameters", () => {
        expect(line).toBeDefined();
    });

    it("get begin point", () => {
        const expectedPoint: Point = new Point(new THREE.Vector3(-5, 4));
        expect(line.beginPoint).toEqual(expectedPoint);
    });

    it("get endPoint", () => {
        const expectedPoint: Point = new Point(new THREE.Vector3(11, 6));
        expect(line.endPoint).toEqual(expectedPoint);
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

    it("lineInDomain should be truthy", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(0, 4, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(0, 6, 10));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        expect(line.lineInDomain(aLine)).toBeTruthy();
    });

    it("lineInDomain should be false", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(-20, 4, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(-50, 6, 10));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        expect(line.lineInDomain(aLine)).not.toBeTruthy();
    });

    it("lineInImage should be truthy", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(0, 4, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(0, 6, 10));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        expect(line.lineInImage(aLine)).toBeTruthy();
    });

    it("lineInImage should be false", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(0, 80, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(0, 100, 10));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        expect(line.lineInImage(aLine)).not.toBeTruthy();
    });

    it("image", () => {
        expect(line.image(19)).toBe(7);
    });

    it("intersection", () => {
        const aFirstPoint: Point = new Point(new THREE.Vector3(1, 4, 10));
        const aSecondPoint: Point  = new Point(new THREE.Vector3(7, 5, 0));
        const aLine: LineEquation = new LineEquation();
        aLine.initialize(aFirstPoint, aSecondPoint);
        const expectedIntersection: Point = new Point(new THREE.Vector3(19, 7));
        expect(line.intersection(aLine)).toEqual(expectedIntersection);
    });

});

