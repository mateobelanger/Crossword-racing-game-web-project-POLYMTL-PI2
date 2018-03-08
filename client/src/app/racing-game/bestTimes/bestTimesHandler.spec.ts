import { BestTimesHandler} from "./bestTimesHandler";

describe("bestTimes", () => {

    let bestTimesHandler: BestTimesHandler;
    // tslint:disable-next-line:no-magic-numbers
    const bestTimes: number[] = [1, 4, 5, 6, 6.5];

    beforeEach(() => {
        bestTimesHandler = new BestTimesHandler( bestTimes );
    });

    afterEach(() => {
        bestTimesHandler = undefined;
    });

    it("should add best times", () => {
        const newBestTime: number = 6.2;
        // tslint:disable-next-line:no-magic-numbers
        const newBestTimes: number[] = [1, 4, 5, 6, newBestTime];
        bestTimesHandler.addTime(newBestTime);
        expect(bestTimesHandler.bestTimes).toEqual(newBestTimes);
    });

    it("should not add best times", () => {
        // tslint:disable-next-line:no-magic-numbers
        bestTimesHandler.addTime(10);
        expect(bestTimesHandler.bestTimes).toEqual(bestTimes);
    });

    it("not full best Times array should add any time", () => {
        // tslint:disable:no-magic-numbers
        bestTimesHandler = new BestTimesHandler([1, 2, 999]);
        bestTimesHandler.addTime(99090909090);
        expect(bestTimesHandler.bestTimes).toEqual([1, 2, 999, 99090909090]);
        // tslint:enable:no-magic-numbers
    });

    it("should get best times", () => {
        expect(bestTimesHandler.bestTimes).toEqual(bestTimes);
    });
});
