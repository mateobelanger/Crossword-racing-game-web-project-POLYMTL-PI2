import { TestBed, inject, async,  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TracksProxyService } from './tracks-proxy.service';
import { TrackData } from "../../../../common/trackData";
import { HttpRequest } from '@angular/common/http';
const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('TracksProxyService', () => {

  const tracks: TrackData[] = [{
                              name: "The HardestThe Harde stThe HardestThe ivyivf super long fucking title yooooooooo",
                              description: "blaaaa bla blaaaa blaaaa blaaaa blaaaa blaaaa blaaaa ",
                              timesPlayed: 12,
                              bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
                              waypoints: [[1, 1, 1], [2, 2, 2]]
                            },
                               {
                              name: "ABCcucucuucucuc",
                              description: "blaaaa ba blaaaa blaaaa ",
                              timesPlayed: 13,
                              bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
                              waypoints: [[1, 1, 1], [2, 2, 2]]

                            },
                               {
                              name: "The Craziest",
                              description: "",
                              timesPlayed: 14,
                              bestTimes: [["gen", 1000000], ["p-o ;)", 0.1]],
                              waypoints: [[1, 1, 1], [2, 2, 2]]
                            }
];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TracksProxyService]
    });
  });

  it('should be created', inject([TracksProxyService], (service: TracksProxyService) => {
    expect(service).toBeTruthy();
  }));

  it("addTracks should send valid data",
     async(inject([TracksProxyService, HttpTestingController],
                  (service: TracksProxyService, backEnd: HttpTestingController) => {
                    service.addTrack(tracks[0]);
                    backEnd.expectOne((req: HttpRequest<any>) => {

                      return (
                        req.url === URI_MONGO_DB &&
                        req.body.name === tracks[0].name &&
                        req.body.description === tracks[0].description &&
                        req.body.timesPlayed === tracks[0].timesPlayed &&
                        req.body.bestTimes === tracks[0].bestTimes &&
                        req.body.waypoints === tracks[0].waypoints
                      );
                    });
        })));

  it("addTracks should add track to tracks array",
     async(inject([TracksProxyService, HttpTestingController],
                  (service: TracksProxyService, backEnd: HttpTestingController) => {
                  service.addTrack(tracks[0]).then(() => {
                    expect(service.tracks[0]).toEqual(tracks[0]);
                  });

                  backEnd.match({
                    url: URI_MONGO_DB,
                    method: 'POST'
                  })[0].flush(tracks[0]);
      );

});
