// import { TestBed, inject } from "@angular/core/testing";
// import * as THREE from "three";

// import { TrackLoaderService } from "./track-loader.service";

// const NUMBER_OF_POINTS: number = 2;


// describe("LoadingTrackHandlerService", () => {

//   const trackLoader: TrackLoaderService = new TrackLoaderService();

//   const points: number[][] = [];
//   for (let i: number = 0; i < NUMBER_OF_POINTS; i++) {
//     points.push([i, i, i]);
//   }
//   let scene: THREE.Scene;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [TrackLoaderService]
//     });

//     scene = new THREE.Scene();
//     trackLoader.points = points;
//     trackLoader.initialize(scene);

//   });

//   it("should be created", inject([TrackLoaderService], (service: TrackLoaderService) => {
//     expect(service).toBeTruthy();
//   }));

//   it("should add waypoints from points", inject([TrackLoaderService], (service: TrackLoaderService) => {

//     expect(trackLoader.waypoints).toBeTruthy();

//     for (let i: number = 0; i < NUMBER_OF_POINTS; i++) {
//       expect(trackLoader.waypoints[i].position.x).toBe(points[i][0]);
//       expect(trackLoader.waypoints[i].position.y).toBe(points[i][1]);
//     }

//   }));

//   it("should add the track to the scene", inject([TrackLoaderService], (service: TrackLoaderService) => {
//     expect(scene.children).toBeTruthy();
//     expect(scene.children.length).toBe(NUMBER_OF_POINTS * 2);
//   }));
// });
