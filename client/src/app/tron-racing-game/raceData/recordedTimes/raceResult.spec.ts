import { RaceResults } from "./raceResults";
// tslint:disable:no-magic-numbers

describe("RaceResult", () => {
    let raceResults: RaceResults;

    beforeEach(() => {
        raceResults = new RaceResults();

        jasmine.addCustomEqualityTester((nb1, nb2) => {
            if (typeof nb1 === "number" && typeof nb2 === "number") {
                return Math.abs(nb1 - nb2) < 0.0001;
            }

            return false;
        });
    });

    afterEach(() => {
        raceResults = null;
    });

    it("doneLap -> nbLap < 3", () => {
        const times: number[] = [12, 23];

        times.forEach((time) => {
            raceResults.doneLap(time);
        });

        expect(raceResults.laps.length).toEqual(2);
        expect(raceResults.totalTime).toEqual(23);
    });

    it("doneLap -> nbLap = 3, should have totalTime", () => {
        const times: number[] = [12, 23, 25];

        times.forEach((time) => {
            raceResults.doneLap(time);
        });

        expect(raceResults.laps.length).toEqual(3);
        expect(raceResults.totalTime).toEqual(25);
    });

    it("doneLap -> nbLap > 3, should not add", () => {
        const times: number[] = [12, 23, 39, 50, 60];

        times.forEach((time) => {
            raceResults.doneLap(time);
        });

        expect(raceResults.laps.length).toEqual(3);
        expect(raceResults.totalTime).toEqual(39);
    });
});
