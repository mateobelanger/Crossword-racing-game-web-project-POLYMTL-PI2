import { TestBed, inject } from "@angular/core/testing";

import { ResultsSimulatorService } from "./results-simulator.service";
import { RaceProgressionHandlerService } from "../raceProgression/race-progression-handler.service";
import { RaceResultsService } from "../recordedTimes/race-results.service";

describe("ResultsSimulatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultsSimulatorService, RaceProgressionHandlerService, RaceResultsService]
    });
  });

  it("should be created", inject([ResultsSimulatorService], (service: ResultsSimulatorService) => {
    expect(service).toBeTruthy();
  }));
});
