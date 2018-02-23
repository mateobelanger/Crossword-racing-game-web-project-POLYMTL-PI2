import { TestBed, inject } from '@angular/core/testing';

import { TracksProxyService } from './tracks-proxy.service';
// import { TrackData } from "../../../../common/communication/trackData";

describe('TracksProxyService', () => {
  // const tracks: TrackData[] = [];
  // const proxy: TracksProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TracksProxyService]
    });
  //   for ( let i: number = 0; i < 5; i++) {
  //     const track: TrackData = {name: i.toString(), description:  "blabla", timesPlayed: 5, bestTimes: [["PO", 12], ["Gi", 15]],
  //                               waypoints: [[1, 1, 1], [200, 200, 1]]};
  //     tracks.push(track);
  //   }
  });

  it('should be created', inject([TracksProxyService], (service: TracksProxyService) => {
    expect(service).toBeTruthy();
  }));

  // it('should find an existing track by its name', inject([TracksProxyService], (service: TracksProxyService) => {
  //   expect(service).toBeTruthy();
  // }));

});
