import { ArrayHelper } from "../../../../../../common/arrayHelper";


describe("Car starting position:", () => {
    // test of the shuffling method and not the actual cars
    it("should be randomized", () => {
        const size: number = 1000;
        const array: number[] = [];

        for (let i: number = 0; i < size; i++) {
            array.push(i);
        }

        const copy: number[] = array.slice(0);

        ArrayHelper.shuffle(array);
        let isShuffled: boolean = false;

        for (let i: number = 0; i < array.length; i++) {
            if (copy[i] !== array[i]) {
                isShuffled = true;
                break;
            }
        }

        expect(isShuffled).toBe(true);
    });
});
