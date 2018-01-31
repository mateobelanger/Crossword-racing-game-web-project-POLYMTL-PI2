import { GridGenerator, MIN_WORD_LENGTH } from "./grid-generator";
import { Word } from "./word";

const assert = require("chai").assert;

describe("Grid generator:", () => {
    let generator: GridGenerator;
    const size: number = 10;
    const nBlackCases: number = 25;
    let words: Word[];

    beforeEach(() => {
        generator = new GridGenerator();
        words = generator.generate(size, size, nBlackCases);
    });

    it("should have 10 rows.", () => {
        const result: number = generator.grid.length;
        assert.equal(result, size);
    });

    it("should have 10 columns.", () => {
        const result: number = generator.grid[0].length;
        assert.equal(result, size);
    });

    it("should place the right amount of black cases.", () => {
        let result: number = 0;

        for (let i: number = 0; i < size; i++) {
            const row: boolean[] = generator.grid[i];

            row.forEach( (value: boolean) => {
                if (value === true) {
                    result++;
                }
            });
        }
        assert.equal(result, nBlackCases);
    });

    it("should generate a list of words.", () => {
        assert.isDefined(words);
    });

    it("shouldn't have words less than "  + MIN_WORD_LENGTH + " characters long.", () => {
        let result: boolean = true;

        for (const word of words) {
            if (word.size < MIN_WORD_LENGTH) {
                result = false;
                break;
            }
        }
        assert.equal(result, true);
    });

    it("every row should have one or two words.", () => {
        const MAX_WORDS: number = 2;
        const MIN_WORDS: number = 1;

        for (let i: number = 0; i < size; i++) {
            let count: number = 0;
            for (const word of words) {
                if (word.direction !== "horizontal") {
                    continue;
                }
                if (word.row === i) {
                    count++;
                }
            }

            assert.isAtMost(count, MAX_WORDS);
            assert.isAtLeast(count, MIN_WORDS);
        }
    });

    it("every column should have one or two words.", () => {
        const MAX_WORDS: number = 2;
        const MIN_WORDS: number = 1;

        for (let i: number = 0; i < size; i++) {
            let count: number = 0;
            for (const word of words) {
                if (word.direction !== "vertical") {
                    continue;
                }
                if (word.column === i) {
                    count++;
                }
            }

            assert.isAtMost(count, MAX_WORDS);
            assert.isAtLeast(count, MIN_WORDS);
        }
    });
});
