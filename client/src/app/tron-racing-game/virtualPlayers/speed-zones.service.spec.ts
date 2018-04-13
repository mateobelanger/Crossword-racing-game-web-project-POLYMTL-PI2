import { TestBed, inject } from '@angular/core/testing';

import { SpeedZonesService } from './speed-zones.service';
import { RaceProgressionHandlerService } from '../raceData/raceProgression/race-progression-handler.service';

describe('SpeedZonesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeedZonesService, RaceProgressionHandlerService]
    });
  });

  it('should be created', inject([SpeedZonesService], (service: SpeedZonesService) => {
    expect(service).toBeTruthy();
  }));
});
