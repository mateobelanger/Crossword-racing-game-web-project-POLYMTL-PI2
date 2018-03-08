import { BestTimesHandler} from "./bestTimesHandler";
// tslint:disable:no-magic-numbers
describe("bestTimes", () => {

    let bestTimesHandler: BestTimesHandler;
    const bestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["fourth", 6], ["third", 5], ["last", 6.5]];

    beforeEach(() => {
        bestTimesHandler = new BestTimesHandler( bestTimes );
    });

    afterEach(() => {
        bestTimesHandler = null;
    });

    it("should not add best times", () => {
        bestTimesHandler.addTime(["good try user", 10]);
        expect(bestTimesHandler.bestTimes).toEqual(bestTimes);
    });

    it("not full best Times array should add any time", () => {
        bestTimesHandler = new BestTimesHandler([["nolife", 1], ["second", 4], ["third", 5]]);
        bestTimesHandler.addTime(["took a nap", 99090909090]);
        expect(bestTimesHandler.bestTimes).toEqual([["nolife", 1], ["second", 4], ["third", 5], ["took a nap", 99090909090]]);
    });

    it("should get sorted best times", () => {
        const sortedBestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["third", 5], ["fourth", 6], ["last", 6.5]];
        expect(bestTimesHandler.bestTimes).toEqual(sortedBestTimes);
    });

    it("should add best times", () => {
        const newBestTime: [string, number] = ["new contester", 6.2];
        const newBestTimes: [string, number][] = [["nolife", 1], ["second", 4], ["third", 5], ["fourth", 6], newBestTime];
        bestTimesHandler.addTime(newBestTime);
        expect(bestTimesHandler.bestTimes).toEqual(newBestTimes);
    });
});
