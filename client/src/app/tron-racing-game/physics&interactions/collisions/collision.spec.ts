import { Collision } from "./collision";
import { Car } from "../cars/car/car";
// import * as THREE from 'three';
import { CollisionType } from "../../constants";

/* tslint:disable: no-magic-numbers */
describe("Collision", () => {

    const car1: Car = new Car();
    const car2: Car = new Car();
    let collision: Collision;

    beforeEach( async (done: DoneFn) => {
        await car1.init();
        await car2.init();
        done();
    });

    afterEach(() => {
        collision = null;
    });

    it("should be instantiated correctly when passing parameters", () => {
        collision = new Collision(car1, car2);
        expect(collision).toBeDefined();
    });

    it("should contain both cars", () => {
        collision = new Collision(car1, car2);
        expect(collision.contains(car1)).toBe(true);
        expect(collision.contains(car2)).toBe(true);
    });

    it("should have the right frontCar and the right backCar", () => {
        car2.setPosition(1, 0, 0);
        collision = new Collision(car1, car2);
        expect(collision.frontCar).toBe(car1);
        expect(collision.backCar).toBe(car2);
    });

    it("should be a collision from the left", () => {
        car2.setPosition(1, 0, 1);
        collision = new Collision(car1, car2);
        expect(collision.type).toBe(CollisionType.FRONT_CAR_HIT_FROM_LEFT);
    });

    it("should be a collision from the right", () => {
        car2.setPosition(1, 0, -1);
        collision = new Collision(car1, car2);
        expect(collision.type).toBe(CollisionType.FRONT_CAR_HIT_FROM_RIGHT);
    });

});
