import { TestBed, inject } from "@angular/core/testing";

import { CollisionHandlerService } from "./collision-handler.service";
import { Car } from "../cars/car/car";

describe("CollisionHandlerService", () => {

    const car1: Car = new Car();
    // const car2: Car = new Car();
    const cars: Car[] = [];
    let collisionHandler: CollisionHandlerService;

    beforeEach( async (done: DoneFn) => {
        TestBed.configureTestingModule({
            providers: [CollisionHandlerService]
        });
        await car1.init();
        cars.push(car1);
        collisionHandler = new CollisionHandlerService();

        done();
    });

    afterEach(() => {
        collisionHandler = null;
    });

    it("should be created", inject([CollisionHandlerService], (service: CollisionHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("handleCarCollisions method sould have been called", inject([CollisionHandlerService], (service: CollisionHandlerService) => {
        spyOn(collisionHandler, "handleCarCollisions");
        collisionHandler.handleCarCollisions();
        expect(collisionHandler.handleCarCollisions).toHaveBeenCalled();
    }));

    it("initialize method sould have been called", inject([CollisionHandlerService], (service: CollisionHandlerService) => {
        spyOn(collisionHandler, "initialize");
        collisionHandler.initialize(cars);
        expect(collisionHandler.initialize).toHaveBeenCalled();
    }));

});
