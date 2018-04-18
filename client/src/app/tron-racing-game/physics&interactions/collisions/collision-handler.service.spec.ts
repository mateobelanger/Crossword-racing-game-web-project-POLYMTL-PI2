import { APP_BASE_HREF } from "@angular/common";
import { TestBed, inject } from "@angular/core/testing";

import { CollisionHandlerService } from "./collision-handler.service";
import { Car } from "../cars/car/car";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";
import { AudioService } from "../../audio/audio.service";

describe("CollisionHandlerService", () => {

    const car1: Car = new Car();
    const cars: Car[] = [];
    let collisionHandler: CollisionHandlerService;

    beforeEach( async (done: DoneFn) => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        });
        car1.init();
        cars.push(car1);
        collisionHandler = new CollisionHandlerService(new AudioService());

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
