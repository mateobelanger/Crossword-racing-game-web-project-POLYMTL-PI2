
export const MIN_WORD_LENGTH: number = 2;
export const DEFAULT_GRID_SIZE: number = 10;

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private blackCases: boolean[][];

    public get rowSize(): number {
        return this.nRows;
    }

    public get columnSize(): number {
        return this.nColumns;
    }

    public get grid(): boolean[][] {
        return this.blackCases;
    }

    public constructor(
        nRows: number = DEFAULT_GRID_SIZE,
        nCols: number = DEFAULT_GRID_SIZE) {

        this.nRows = nRows;
        this.nColumns = nCols;

        this.blackCases = [];
        for (let i: number = 0; i < nRows; i++) {
            let row: boolean[] = [];
            for(let j: number = 0; j < nCols; j++){
                row.push();
            }
            this.blackCases.push(row);
        }
    }

    public generate(nBlackCases: number){
        this.fill(nBlackCases);
    }

    public set(row: number, col: number, value: boolean): void {
        if (row >= this.nRows || row < 0) {
            return;
        }
        if (col >= this.nColumns || col < 0) {
            return;
        }

        this.blackCases[row][col] = value;
    }

    public reset(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; i < this.nColumns; j++) {
                this.set(i, j, false);
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    public fill(nBlackCases: number): void {
        if (nBlackCases <= 0) {
            this.reset();
            return;
        }

        let temp: number = 0;
        let i: number = 0;
        let j: number = 0;
        const BLACK_CASES_POSITION: [number, number][] = [];    //array of pair
        
        
        // Reservoir-sampling-inspired algorithm to place black cases randomly
        for (; i < this.nRows; i++) {
            for (; j < this.nColumns; j++) {

                // ignores corners to prevent words too short
                if ((i < MIN_WORD_LENGTH || i > this.nRows - 1 - MIN_WORD_LENGTH)
                        && (j < MIN_WORD_LENGTH || j > this.nColumns - 1 - MIN_WORD_LENGTH)) {
                    continue;
                }
                this.set(i, j, true);
                BLACK_CASES_POSITION.push([i, j]);

                if (++temp === nBlackCases) {
                    j++;
                    break;
                }
            }
            if (temp === nBlackCases) {
                break;
            }
            j = 0;
        }

        for (; i < this.nRows; i++) {
            for (; j < this.nColumns; j++) {
                if ((i < MIN_WORD_LENGTH || i > this.nRows - 1 - MIN_WORD_LENGTH)
                        && (j < MIN_WORD_LENGTH || j > this.nColumns - 1 - MIN_WORD_LENGTH)) {
                    continue;
                }
                const RANGE: number = i * this.nColumns + j;
                const SEED: number = Math.floor(Math.random() * RANGE);
                if (SEED < nBlackCases) {
                    const ROW: number = BLACK_CASES_POSITION[SEED][0];
                    const COLUMN: number = BLACK_CASES_POSITION[SEED][1];
                    this.set(ROW, COLUMN, false);

                    BLACK_CASES_POSITION[SEED] = [i, j];
                    this.set(i, j, true);
                }
            }
            j = 0;
        }

    }
}

module.exports = GridGenerator;