// import { TestBed, inject, async, } from "@angular/core/testing";
// import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
// import { TracksProxyService } from "./tracks-proxy.service";
// import { ITrackData } from "../../../../../common/ItrackData";
// import { HttpRequest } from "@angular/common/http";
// const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

// // tslint:disable:no-magic-numbers
// // tslint:disable:no-any
// describe("TracksProxyService", () => {

//     const tracks: ITrackData[] = [
//     {
//         name: "The HardestThe Harde stThe HardestThe ivyivf super long fucking title yooooooooo",
//         description: "blaaaa bla blaaaa blaaaa blaaaa blaaaa blaaaa blaaaa ",
//         timesPlayed: 12,
//         bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
//         waypoints: [[1, 1, 1], [2, 2, 2]],
//         image: "ab"
//     },
//     {
//         name: "ABCcucucuucucuc",
//         description: "blaaaa ba blaaaa blaaaa ",
//         timesPlayed: 13,
//         bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
//         waypoints: [[1, 1, 1], [2, 2, 2]],
//         image: "cd"

//     },
//     {
//         name: "The Craziest",
//         description: "",
//         timesPlayed: 14,
//         bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
//         waypoints: [[1, 1, 1], [2, 2, 2]],
//         image: "ef"
//     }
//     ];

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule],
//             providers: [TracksProxyService]
//         });
//     });

//     afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
//         backend.verify();
//     }));

//     it("should be created", inject([TracksProxyService], (service: TracksProxyService) => {
//         expect(service).toBeTruthy();
//     }));

//     it("initialize should fetch tracks",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.initialize();
//                 backEnd.match({
//                     url: URI_MONGO_DB,
//                     method: "GET"
//                 });
//             })));

//     it("addTrack should send valid data",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.addTrack(tracks[0]);
//                 backEnd.expectOne((req: HttpRequest<any>) => {

//                     return (
//                         req.url === URI_MONGO_DB &&
//                         req.body.name === tracks[0].name &&
//                         req.body.description === tracks[0].description &&
//                         req.body.timesPlayed === tracks[0].timesPlayed &&
//                         req.body.bestTimes === tracks[0].bestTimes &&
//                         req.body.waypoints === tracks[0].waypoints
//                     );
//                 });
//             })));

//     it("addTrack should add track to tracks array",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.addTrack(tracks[0]).then(() => {
//                     expect(service.tracks[0]).toEqual(tracks[0]);
//                 });

//                 backEnd.match({
//                     url: URI_MONGO_DB,
//                     method: "POST"
//                 })[0].flush(tracks[0]);
//             })));

//     it("get tracks should return tracks",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.addTrack(tracks[0]).then(() => {
//                     expect(service.tracks).toEqual([tracks[0]]);
//                 });

//                 backEnd.match({
//                     url: URI_MONGO_DB,
//                     method: "POST"
//                 })[0].flush(tracks[0]);
//             })));


//     it("deleteTrack should send valid trackName",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.deleteTrack(tracks[0].name);
//                 backEnd.expectOne((req: HttpRequest<any>) => {

//                     return (
//                         req.url === URI_MONGO_DB + "/" + tracks[0].name
//                     );
//                 });
//             })));


//     it("saveTrack on track not in database should send valid data",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.saveTrack(tracks[0]);
//                 backEnd.expectOne((req: HttpRequest<any>) => {

//                     return (
//                         req.url === URI_MONGO_DB &&
//                         req.body.name === tracks[0].name &&
//                         req.body.description === tracks[0].description &&
//                         req.body.timesPlayed === tracks[0].timesPlayed &&
//                         req.body.bestTimes === tracks[0].bestTimes &&
//                         req.body.waypoints === tracks[0].waypoints
//                     );
//                 });
//             })));

//     it("saveTrack should only add track to tracks array and send POST request",
//        async(inject([TracksProxyService, HttpTestingController],
//                     (service: TracksProxyService, backEnd: HttpTestingController) => {
//                 void service.saveTrack(tracks[0]).then(() => {
//                     expect(service.tracks[0]).toEqual(tracks[0]);
//                 });

//                 backEnd.match({
//                     url: URI_MONGO_DB,
//                     method: "POST"
//                 })[0].flush(tracks[0]);
//             })));
// });

