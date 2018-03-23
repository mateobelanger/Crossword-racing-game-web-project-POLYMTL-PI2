// import { Collision } from "./collision";
// import { Car } from "../car/car";
// import * as THREE from 'three';
// // import { CollisionType } from "../constants";

// import {} from "jasmine"; // TODO: pourquoi besoin d'importer?

// /* tslint:disable: no-magic-numbers */
// describe("Collision", () => {

//     const car1: Car = new Car();
//     const car2: Car = new Car();
//     let collision: Collision;

//     beforeEach( async () => {
//         await car1.init();
//         await car2.init();
//     });

//     afterEach(() => {
//         // car1 = null;
//         // car2 = null;
//         collision = null;
//     });

//     it("should be instantiated correctly when passing parameters", () => {
//         console.log(car1);
//         console.log(car2);
//         console.log(car2.getPosition);
//         collision = new Collision(car1, car2);
//         expect(collision).toBeDefined();
//     });

//     it("should contain both cars", () => {
//         collision = new Collision(car1, car2);
//         expect(collision.contains(car1)).toBe(true);
//         expect(collision.contains(car2)).toBe(true);
//     });

// });
