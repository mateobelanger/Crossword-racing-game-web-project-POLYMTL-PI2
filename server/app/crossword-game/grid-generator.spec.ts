import { GridGenerator } from "./grid-generator";

const assert = require("assert");
GridGenerator = require("./grid-generator");


describe("Grid generator:", () => {
    let generator: GridGenerator;
    const size: number = 10;
    beforeEach(() => {
        // tslint:disable-next-line:no-magic-numbers
        generator = new GridGenerator();
    });

    it("should have 10 rows.", () => {
        let result: number = generator.rowSize;
        assert.equal(result, size);
    });

    it("should have 10 columns.", () => {
        let result: number = generator.columnSize;
        assert.equal(result, size);
    });

    it("should have no black cases after initialization.", () => {
        let grid: boolean[][] = generator.grid;
        let result: boolean = true;
        for(let i: number = 0; i < generator.rowSize; i++){
            result = grid[i].every( (value: boolean): boolean => {
                return value == false;
            } );
            if(result == false){
                break;
            }
        }
        assert.equal(result, true);
    });

    it("set() method should change the value in the array.", () => {
        const row: number = Math.floor((Math.random() * size));
        const col: number = Math.floor((Math.random() * size));;
        const result: boolean = true;
        generator.set(row, col, result);
        let grid: boolean[][] = generator.grid;
        assert.equal(grid[row][col], result);
    });

    it("fill() method should place the right amount of black cases.", () => {
        const nBlackCases: number = 20;
        generator.fill(nBlackCases);
        const grid = generator.grid;
        let result: number = 0;
        for(let i: number = 0; i < generator.rowSize; i++){
            grid[i].forEach( (value: boolean) => {
                if(value == true){
                    result++;
                }
            })
        }
        assert.equal(result, nBlackCases);
    });

});
