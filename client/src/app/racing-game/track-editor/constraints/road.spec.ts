import { Road } from "./road";
import * as THREE from "three";
/*tslint:disable:no-magic-numbers*/
/*tslint:disable:no-console*/

describe("Road", () => {

    const road: Road = new Road(new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 4, 0), 0);
    road.initialize();

    it("should be instanciable with constructor with parameters", () => {
        expect(road).toBeDefined();
    });

    it("should be instanciable with default constructor", () => {
        const aRoad: Road = new Road();
        expect(aRoad).toBeDefined();
    });

    it("hasValidWidthHeightRatio should be false", () => {
        expect(road.hasValidWidthHeightRatio()).not.toBeTruthy();
    });

    it("hasValidWidthHeightRatio should be true", () => {
        const aRoad: Road = new Road(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 100, 0), 1);
        aRoad.initialize();
        expect(aRoad.hasValidWidthHeightRatio()).toBeTruthy();
    });

    it("hasValidAngle should be true", () => {
        const aRoad: Road = new Road(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 10, 0), 1);
        aRoad.initialize();
        road.previousRoad = aRoad;
        expect(road.hasValidAngle()).toBeTruthy();
    });

    it("hasValidAngle should be false", () => {
        const aRoad: Road = new Road(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, -1, 0), 1);
        aRoad.initialize();
        road.previousRoad = aRoad;
        expect(road.hasValidAngle()).not.toBeTruthy();
    });

    it("intersect function normal lineEquation - crossing in domain", () => {
        const aRoad: Road = new Road(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(100, 40, 0), 1);
        aRoad.initialize();
        expect(road.intersects(aRoad)).toBeTruthy();
    });

    it("intersect function normal lineEquation - not crossing in domain", () => {
        const aRoad: Road = new Road(new THREE.Vector3(-5, 10, 0), new THREE.Vector3(-2, 40, 0), 1);
        aRoad.initialize();
        expect(road.intersects(aRoad)).not.toBeTruthy();
    });

    it("intersect function normal lineEquation and vertical line - crossing in domain", () => {
        const aRoad: Road = new Road(new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 40, 0), 1);
        aRoad.initialize();
        expect(road.intersects(aRoad)).toBeTruthy();
    });

    it("intersect function normal lineEquation and vertical - not crossing in domain", () => {
        const aRoad: Road = new Road(new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-5, 40, 0), 1);
        aRoad.initialize();
        expect(road.intersects(aRoad)).not.toBeTruthy();
    });

    it("intersect function both vertical - crossing in domain", () => {
        const verticalRoad1: Road = new Road(new THREE.Vector3(-5, 10, 0), new THREE.Vector3(-5, 40, 0), 1);
        verticalRoad1.initialize();
        const verticalRoad2: Road = new Road(new THREE.Vector3(-5, 10, 0), new THREE.Vector3(-5, 40, 0), 2);
        verticalRoad2.initialize();
        expect(verticalRoad1.intersects(verticalRoad2)).toBeTruthy();
    });

    it("intersect function both vertical - not crossing in domain", () => {
        const verticalRoad1: Road = new Road(new THREE.Vector3(-5, 10, 0), new THREE.Vector3(-2, 40, 0), 1);
        verticalRoad1.initialize();
        const verticalRoad2: Road = new Road(new THREE.Vector3(-6, 10, 0), new THREE.Vector3(-6, 40, 0), 2);
        verticalRoad2.initialize();
        expect(verticalRoad1.intersects(verticalRoad2)).not.toBeTruthy();
    });

    it("intersect function both vertical - crossing in domain but not image", () => {
        const verticalRoad1: Road = new Road(new THREE.Vector3(-5, 10, 0), new THREE.Vector3(-5, 40, 0), 1);
        verticalRoad1.initialize();
        const verticalRoad2: Road = new Road(new THREE.Vector3(-5, -100, 0), new THREE.Vector3(-5, -40, 0), 2);
        verticalRoad2.initialize();
        expect(verticalRoad1.intersects(verticalRoad2)).not.toBeTruthy();
    });

});
