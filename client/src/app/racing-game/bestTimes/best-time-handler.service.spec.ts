import { TestBed, inject } from '@angular/core/testing';
import { BestTimeHandlerService } from './best-time-handler.service';

// tslint:disable:no-magic-numbers

describe('BestTimeHandlerService', () => {

  const bestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["fourth", 6], ["third", 5], ["last", 6.5]];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BestTimeHandlerService]
    });
  });

  it('should be created', inject([BestTimeHandlerService], (service: BestTimeHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it("should not add best times", inject([BestTimeHandlerService], (service: BestTimeHandlerService) => {
    service.bestTimes = bestTimes;
    service.addTime(["good try user", 10]);
    expect(service.bestTimes).toEqual(bestTimes);
  }));

  it("not full best Times array should add any time", inject([BestTimeHandlerService], (service: BestTimeHandlerService) => {
    service.bestTimes = [["nolife", 1], ["second", 4], ["third", 5]];
    service.addTime(["took a nap", 99090909090]);
    expect(service.bestTimes).toEqual([["nolife", 1], ["second", 4], ["third", 5], ["took a nap", 99090909090]]);
  }));

  it("should get sorted best times", inject([BestTimeHandlerService], (service: BestTimeHandlerService) => {
    service.bestTimes = bestTimes;
    const sortedBestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["third", 5], ["fourth", 6], ["last", 6.5]];
    expect(service.bestTimes).toEqual(sortedBestTimes);
  }));

  it("should add best times", inject([BestTimeHandlerService], (service: BestTimeHandlerService) => {
    service.bestTimes = bestTimes;
    const newBestTime: [string, number] = ["new contester", 6.2];
    const newBestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["third", 5], ["fourth", 6], newBestTime];
    service.addTime(newBestTime);
    expect(service.bestTimes).toEqual(newBestTimes);
  }));

});
