import { TestBed, inject } from '@angular/core/testing';
import { TracksProxyService } from "./tracks-proxy.service";
import { RaceDataHandlerService } from './race-data-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BestTimeHandlerService } from './bestTimes/best-time-handler.service';
import { TrackLoaderService } from './track-loader.service';
// tslint:disable:no-magic-numbers
describe('RaceDataHandlerService', () => {

    let raceDataHandler: RaceDataHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RaceDataHandlerService, TracksProxyService, BestTimeHandlerService, TrackLoaderService]
        });
        raceDataHandler = TestBed.get(RaceDataHandlerService);

    });

    it('should be created', inject([RaceDataHandlerService], (service: RaceDataHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("doneLap -> nbLap < 3", () => {
        const timeLaps: number[] = [10.4, 14];
        timeLaps.forEach((elem) => {
            raceDataHandler.doneLap();
        });
        timeLaps.push(0);
        expect(raceDataHandler.timeLaps[0]).toBeCloseTo(timeLaps[0]);
        expect(raceDataHandler.timeLaps[1]).toBeCloseTo(timeLaps[1]);
        expect(raceDataHandler.timeLaps[2]).toBeCloseTo(timeLaps[2]);
        expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length - 1);
    });

    it("doneLap -> nbLap = 3", () => {
        const timeLaps: number[] = [10.4, 25, 35];
        timeLaps.forEach((elem) => {
            raceDataHandler.doneLap();
        });
        expect(raceDataHandler.timeLaps[0]).toBeCloseTo(timeLaps[0]);
        expect(raceDataHandler.timeLaps[1]).toBeCloseTo(timeLaps[1]);
        expect(raceDataHandler.timeLaps[2]).toBeCloseTo(timeLaps[2]);
        expect(raceDataHandler.lapElapsed).toEqual(timeLaps.length);
    });

    it("doneLap -> nbLap > 3, should not get higher than 3", () => {
        const timeLaps: number[] = [10.4, 25, 35, 45, 67, 89];
        timeLaps.forEach((elem) => {
            raceDataHandler.doneLap();
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
            raceDataHandler.doneLap();
        });
        expect(raceDataHandler.totalTime()).toEqual(totalTime);
    });

});

