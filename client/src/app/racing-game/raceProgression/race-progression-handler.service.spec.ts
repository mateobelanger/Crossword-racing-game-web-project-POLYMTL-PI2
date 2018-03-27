import { TestBed, inject } from '@angular/core/testing';

import { RaceProgressionHandlerService } from './race-progression-handler.service';

describe('RaceProgressionHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceProgressionHandlerService]
    });
  });

  it('should be created', inject([RaceProgressionHandlerService], (service: RaceProgressionHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([RaceProgressionHandlerService], (service: RaceProgressionHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
