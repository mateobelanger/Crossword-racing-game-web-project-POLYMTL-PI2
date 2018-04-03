import { TestBed, inject } from '@angular/core/testing';

import { ResultsSimulatorService } from './results-simulator.service';

describe('ResultsSimulatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultsSimulatorService]
    });
  });

  it('should be created', inject([ResultsSimulatorService], (service: ResultsSimulatorService) => {
    expect(service).toBeTruthy();
  }));
});
