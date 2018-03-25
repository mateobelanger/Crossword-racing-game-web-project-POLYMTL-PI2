import { OutOfBoundsHandlerService } from "./out-of-bounds-handler.service";
import { CarHandlerService } from "../cars/car-handler.service";
import { inject, TestBed } from '@angular/core/testing';
import * as THREE from 'three';

/* tslint:disable: no-magic-numbers */
describe("Collision", () => {

    const car1: Car = new Car();
    const car2: Car = new Car();
    let collision: Collision;

    beforeEach( async () => {
        TestBed.configureTestingModule({
            providers: [OutOfBoundsHandlerService]
        });
        await car1.init();
        await car2.init();
    });

    afterEach(() => {
        // car1 = null;
        // car2 = null;
        collision = null;
    });

    it('should be created', inject([OutOfBoundsHandlerService], (service: OutOfBoundsHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("should be instantiated correctly when passing parameters", () => {
        console.log(car1);
        console.log(car2);
        console.log(car2.getPosition);
        collision = new Collision(car1, car2);
        expect(collision).toBeDefined();
    });

    it("should contain both cars", () => {
        collision = new Collision(car1, car2);
        expect(collision.contains(car1)).toBe(true);
        expect(collision.contains(car2)).toBe(true);
    });

});