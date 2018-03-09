import { TestBed, inject } from '@angular/core/testing';
import { TracksProxyService} from "./tracks-proxy.service";
import { RaceDataHandlerService } from './race-data-handler.service';
import { ITrackData } from '../../../../common/trackData';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RaceDataHandlerService, TracksProxyService, ]
    });

    jasmine.addCustomEqualityTester((nb1, nb2) => {
      if (typeof nb1 === "number" && typeof nb2 === "number")
        return Math.abs(nb1 - nb2) < 0.0001;

      return false;
    });

  });

  it('should be created', inject([RaceDataHandlerService],
                                 (service: RaceDataHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it("doneLap -> nbLap < 3", inject([RaceDataHandlerService],
                                    (service: RaceDataHandlerService) => {
      const timeLaps: number[] = [10.4, 14];
      timeLaps.forEach((elem) => {
        service.doneLap();
      });
      timeLaps.push(0);
      expect(service.lapElapsed).toEqual(timeLaps.length - 1);
  }));

  it("doneLap -> nbLap = 3", inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
    const timeLaps: number[] = [10.4, 25, 35];
    timeLaps.forEach((elem) => {
      service.doneLap();
    });
    expect(service.lapElapsed).toEqual(timeLaps.length);
  }));

  it("doneLap -> nbLap > 3, should not get higher than 3", inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
    const timeLaps: number[] = [10.4, 25, 35, 45, 67, 89];
    timeLaps.forEach((elem) => {
      service.doneLap();
    });
    expect(service.lapElapsed).toEqual(3);
  }));

});

