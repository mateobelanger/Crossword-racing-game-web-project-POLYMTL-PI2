import { GridGenerator, MIN_WORD_LENGTH, BLACK_CELL, DEFAULT_GRID_SIZE } from "./gridGenerator";
import { GridEntry } from "./GridEntry";
import { Direction } from "../../../common/crosswordsInterfaces/word";
import { assert } from "chai";

describe("Grid generator:", () => {
    let generator: GridGenerator;
    const nBlackCases: number = 0;
    let words: GridEntry[];
    const difficulty: string = "easy";

    beforeEach(() => {
        generator = new GridGenerator();
        words = generator.generate(nBlackCases, difficulty);
    });

    it("should have " + DEFAULT_GRID_SIZE + " rows.", () => {
        const result: number = generator.grid.length;
        assert.equal(result, DEFAULT_GRID_SIZE);
    });

    it("should have " + DEFAULT_GRID_SIZE + " columns.", () => {
        const result: number = generator.grid[0].length;

        assert.equal(result, DEFAULT_GRID_SIZE);
    });

    it("should place the right amount of black cases.", () => {
        let result: number = 0;

        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            const row: string[] = generator.grid[i];

            row.forEach( (value: string) => {
                if (value === BLACK_CELL) {
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
            if (word.word.value.length < MIN_WORD_LENGTH) {
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
            for (const entry of words) {
                if (entry.word.direction !== Direction.HORIZONTAL) {
                    continue;
                }
                if (entry.word.row === i) {
                    count++;
                }
            }
            assert.isAtLeast(count, MIN_WORDS);
        }
    });

    it("every column should have at least one word.", () => {
        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            let count: number = 0;
            for (const entry of words) {
                if (entry.word.direction !== Direction.VERTICAL) {
                    continue;
                }
                if (entry.word.column === i) {
                    count++;
                }
            }
            assert.isAtLeast(count, MIN_WORDS);
        }
    });
});
