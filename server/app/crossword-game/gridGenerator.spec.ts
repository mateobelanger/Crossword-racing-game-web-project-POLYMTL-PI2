import { GridGenerator, MIN_WORD_LENGTH, DEFAULT_GRID_SIZE } from "./gridGenerator";
import { Word } from "./word";
import { assert } from "chai";

describe("Grid generator:", () => {
    let generator: GridGenerator;
    const nBlackCases: number = 25;
    let words: Word[];

    beforeEach(() => {
        generator = new GridGenerator();
        words = generator.generate(DEFAULT_GRID_SIZE, DEFAULT_GRID_SIZE, nBlackCases);
    });

    it("should have 10 rows.", () => {
        const result: number = generator.grid.length;

        assert.equal(result, DEFAULT_GRID_SIZE);
    });

    it("should have 10 columns.", () => {
        const result: number = generator.grid[0].length;

        assert.equal(result, DEFAULT_GRID_SIZE);
    });

    it("should place the right amount of black cases.", () => {
        let result: number = 0;

        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
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

    const MIN_WORDS: number = 1;
    it("every row should have at least one word.", () => {
        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            let count: number = 0;
            for (const word of words) {
                if (word.direction !== "horizontal") {
                    continue;
                }
                if (word.row === i) {
                    count++;
                }
            }
            assert.isAtLeast(count, MIN_WORDS);
        }
    });

    it("every column should have at least one word.", () => {
        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            let count: number = 0;
            for (const word of words) {
                if (word.direction !== "vertical") {
                    continue;
                }
                if (word.column === i) {
                    count++;
                }
            }
            assert.isAtLeast(count, MIN_WORDS);
        }
    });
});
