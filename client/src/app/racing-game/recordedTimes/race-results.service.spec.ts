import { TestBed, inject } from '@angular/core/testing';
import { RaceResultsService } from './race-results.service';

// tslint:disable: no-magic-numbers
const NAMES: string[] = ["bob1", "bob2", "bob3", "bob4", "bob5", "user"];
describe('RaceResultsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceResultsService]
    });
  });

  it('should be created', inject([RaceResultsService], (service: RaceResultsService) => {
    expect(service).toBeTruthy();
  }));

  it('doneLap should find right player', inject([RaceResultsService], (service: RaceResultsService) => {
    service.initialize(NAMES);
    service.doneLap(NAMES[0], 90);

    expect(service.getPlayerRaceResults(NAMES[0]).laps[0]).toEqual(90);
  }));
});
