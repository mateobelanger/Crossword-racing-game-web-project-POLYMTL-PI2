import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { LoadingTrackHandlerService } from "./loading-track-handler.service";

const NUMBER_OF_POINTS: number = 2;


describe("LoadingTrackHandlerService", () => {

    const loadingTrackHandlerService: LoadingTrackHandlerService = new LoadingTrackHandlerService();

    const points: number[][] = [];
    for (let i: number = 0; i < NUMBER_OF_POINTS; i++) {
        points.push([i, i, i]);
    }
    let scene: THREE.Scene;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingTrackHandlerService]
        });

        scene = new THREE.Scene();
        loadingTrackHandlerService.points = points;
        loadingTrackHandlerService.initialize(scene);

    });

    it("should be created", inject([LoadingTrackHandlerService], (service: LoadingTrackHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("should add waypoints from points", inject([LoadingTrackHandlerService], (service: LoadingTrackHandlerService) => {

        expect(loadingTrackHandlerService.waypoints).toBeTruthy();

        for (let i: number = 0; i < NUMBER_OF_POINTS; i++) {
            expect(loadingTrackHandlerService.waypoints[i].position.x).toBe(points[i][0]);
            expect(loadingTrackHandlerService.waypoints[i].position.y).toBe(points[i][1]);
        }

    }));

    it("should add the track to the scene", inject([LoadingTrackHandlerService], (service: LoadingTrackHandlerService) => {
        expect(scene.children).toBeTruthy();
        expect(scene.children.length).toBe(NUMBER_OF_POINTS * 2);
    }));
});
