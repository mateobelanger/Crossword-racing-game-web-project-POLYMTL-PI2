import { TestBed, inject } from '@angular/core/testing';

import { RaceDataHandlerService } from './race-data-handler.service';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

    let raceDataHandler: RaceDataHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RaceDataHandlerService]
        });
        raceDataHandler = TestBed.get(RaceDataHandlerService);

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
        expect(raceDataHandler.timeLaps[0]).toBeCloseTo(timeLaps[0]);
        expect(raceDataHandler.timeLaps[1]).toBeCloseTo(timeLaps[1]);
        expect(raceDataHandler.timeLaps[2]).toBeCloseTo(timeLaps[2]);
        expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length - 1);
    });

    it("doneLap -> nbLap = 3", () => {
        const timeLaps: number[] = [10.4, 25, 35];
        let totalTime: number = 0;
        timeLaps.forEach((elem) => {
            totalTime += elem;
            raceDataHandler.doneLap(totalTime);
        });
        expect(raceDataHandler.timeLaps[0]).toBeCloseTo(timeLaps[0]);
        expect(raceDataHandler.timeLaps[1]).toBeCloseTo(timeLaps[1]);
        expect(raceDataHandler.timeLaps[2]).toBeCloseTo(timeLaps[2]);
        expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length);
    });

    it("doneLap -> nbLap > 3, should not get higher than 3", () => {
        const timeLaps: number[] = [10.4, 25, 35, 45, 67, 89];
        let totalTime: number = 0;
        timeLaps.forEach((elem) => {
            totalTime += elem;
            raceDataHandler.doneLap(totalTime);
        });
        expect(raceDataHandler.timeLaps[0]).toBeCloseTo(timeLaps[0]);
        expect(raceDataHandler.timeLaps[1]).toBeCloseTo(timeLaps[1]);
        expect(raceDataHandler.timeLaps[2]).toBeCloseTo(timeLaps[2]);
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
