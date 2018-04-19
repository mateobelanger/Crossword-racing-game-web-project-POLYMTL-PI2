import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";
import { RaceProgressionHandlerService } from "./race-progression-handler.service";

describe("RaceProgressionHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RaceProgressionHandlerService]
        });
    });

    it("should be created", inject([RaceProgressionHandlerService], (service: RaceProgressionHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("user should not be first", inject([RaceProgressionHandlerService], (service: RaceProgressionHandlerService) => {
        // tslint:disable:no-magic-numbers
        const carPositions: {[playerName: string]: THREE.Vector3} = {
            "bob0": new THREE.Vector3(10, 10, 10),
            "bob1": new THREE.Vector3(12, 14, 109),
            "bob2": new THREE.Vector3(14, 2, 9),
            "user": new THREE.Vector3(0, 0, 0),

        };
        const waypoints: [number, number, number][] = [[0, 0, 0], [100, 100, 100]];
        // tslint:enable:no-magic-numbers
        service.initialize(carPositions, waypoints).then(   () => {},
                                                            () => {});
        expect(service.isUserFirst()).toBeFalsy();
    }));
});
