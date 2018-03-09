import { TestBed, inject } from '@angular/core/testing';

import { RaceDataHandlerService } from './race-data-handler.service';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

  let raceDataHandler: RaceDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceDataHandlerService]
    });
    raceDataHandler = new RaceDataHandlerService();

    jasmine.addCustomEqualityTester((nb1, nb2) => {
      if (typeof nb1 === "number" && typeof nb2 === "number")
        return Math.abs(nb1 - nb2) < 0.0001;
    });

  });

  it('should be created', inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it("doneLap -> nbLap < 3", () => {
      const timeLaps: number[] = [10.4, 14];
      let totalTime: number = 0;
      timeLaps.forEach((elem) => {
        totalTime += elem;
        raceDataHandler.doneLap(totalTime);
      });
      timeLaps.push(0);
      expect(raceDataHandler.timeLaps).toEqual(timeLaps);
      expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length - 1);
  });

  it("doneLap -> nbLap = 3", () => {
    const timeLaps: number[] = [10.4, 25, 35];
    let totalTime: number = 0;
    timeLaps.forEach((elem) => {
      totalTime += elem;
      raceDataHandler.doneLap(totalTime);
    });
    expect(raceDataHandler.timeLaps).toEqual(timeLaps);
    expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length);
  });

  it("doneLap -> nbLap > 3, should not get higher than 3", () => {
    const timeLaps: number[] = [10.4, 25, 35, 45, 67, 89];
    let totalTime: number = 0;
    timeLaps.forEach((elem) => {
      totalTime += elem;
      raceDataHandler.doneLap(totalTime);
    });
    expect(raceDataHandler.timeLaps).toEqual([10.4, 25, 35]);
    expect(raceDataHandler.lapElapsed).toEqual(3);
  });

  it("totalTime", () => {
    const timeLaps: number[] = [10.4, 25, 35];
    let totalTime: number = 0;

    timeLaps.forEach((elem) => {
      totalTime += elem;
      raceDataHandler.doneLap(totalTime);
    });
    expect(raceDataHandler.totalTime()).toEqual(totalTime);
  });

});
