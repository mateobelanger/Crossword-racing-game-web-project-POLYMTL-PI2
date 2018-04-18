import { Timer } from "./timer";
const SECONDS: number = 1;
describe("Timer", () => {

    let timer: Timer;

    // tslint:disable-next-line
    function wait(seconds: number): void { // tslint:disable-next-line:no-magic-numbers
        for (let i: number = 0; i < 10000000; i++) {}
    }
    beforeEach(() => {
        timer = new Timer();
    });

    it("should be defined", () => {
        expect(timer).toBeDefined();
    });

    it("should start", () => {
        timer.start();
        wait( SECONDS );
        expect(timer.millisecondsElapsed).toBeGreaterThan(0);
    });

    it("should stop", () => {
        timer.start();
        wait( SECONDS );
        timer.stop();
        const stoppedTime: number = timer.millisecondsElapsed;
        timer.start();
        wait( SECONDS );
        expect(timer.millisecondsElapsed).toBeGreaterThan(stoppedTime);
    });

    it("should reset", () => {
        timer.start();
        wait( SECONDS );
        timer.reset();
        expect(timer.millisecondsElapsed).toEqual(0);
    });

    it("should stop and continue", () => {
        timer.start();
        wait( SECONDS * 2 );
        timer.stop();
        const stoppedTime: number = timer.millisecondsElapsed;
        timer.start();
        wait( SECONDS );
        expect(timer.millisecondsElapsed).toBeGreaterThan(stoppedTime);
    });
});
