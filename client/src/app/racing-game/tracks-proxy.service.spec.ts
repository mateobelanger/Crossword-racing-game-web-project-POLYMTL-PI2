import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TracksProxyService } from './tracks-proxy.service';
// import { TrackData } from "../../../../common/communication/trackData";

describe('TracksProxyService', () => {
  let tracksProxyService: TracksProxyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TracksProxyService]
    });
    tracksProxyService = TestBed.get(TracksProxyService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', inject([TracksProxyService], (service: TracksProxyService) => {
    expect(service).toBeTruthy();
  }));

  // it('should find an existing track by its name', inject([TracksProxyService], (service: TracksProxyService) => {
  //   expect(service).toBeTruthy();
  // }));

});
