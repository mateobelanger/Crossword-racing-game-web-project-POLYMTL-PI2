import { TestBed, inject } from '@angular/core/testing';
import { TracksProxyService} from "./tracks-proxy.service";
import { RaceDataHandlerService } from './race-data-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BestTimeHandlerService } from './recordedTimes/best-time-handler.service';
import { RaceResultsService } from './recordedTimes/race-results.service';
import { RaceProgressionHandlerService } from './raceProgression/race-progression-handler.service';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RaceDataHandlerService, TracksProxyService, BestTimeHandlerService, RaceResultsService, RaceProgressionHandlerService]
    });
  });

  it('should be created', inject([RaceDataHandlerService],
                                 (service: RaceDataHandlerService) => {
    expect(service).toBeTruthy();
  }));

});

