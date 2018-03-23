import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";

export const MIN_WORD_LENGTH: number = 3;
export const DEFAULT_GRID_SIZE: number = 10;
export const BLACK_CELL: string = "#";
export const WHITE_CELL: string = "-";
const MAX_FIX_ISSUES: number = 500;

export class GridCreator {
    private _nRows: number;
    private _nColumns: number;
    private _grid: string[][];

    public constructor() {
        this._nRows = DEFAULT_GRID_SIZE;
        this._nColumns = DEFAULT_GRID_SIZE;
    }

    public get grid(): string[][] {
        return this._grid;
    }

    public create(nBlackCells: number): GridWord[] {
        this.initializeGrid();
        this.placeBlackCells(nBlackCells);
        // calls itself again if the configuration is impossible to fix.
        try {
            this.fixCellsLayout();
        } catch (err) {
            this.create(nBlackCells);
        }

        return this.generateGridStructure();
    }

    private fixCellsLayout(): void {
        let nIssues: number = 0;
        for (let i: number = 0; i < this._nRows; i++) {
            if (nIssues > MAX_FIX_ISSUES) {
                throw new Error;
            }
            for (let j: number = 0; j < this._nColumns; j++) {
                if (this.isLoneCell(i, j)) {
                    this.fixLoneCell(i, j);
                    nIssues++;
                    i = 0; j = -1;
                }
            }
            const row: string[] = this._grid[i];
            let nRemovedBlackCells: number = 0;
            if (!this.hasWords(row)) {
                nRemovedBlackCells += this.fixNoWords(row);
                nIssues++; i = -1;
            }
            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                nRemovedBlackCells += this.fixNoWords(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[j][i] = column[j];
                }
                nIssues++; i = -1;
            }
            this.setRandomly(BLACK_CELL, nRemovedBlackCells);
        }
    }

    private generateGridStructure(): GridWord[] {
        let words: GridWord[] = [];
        for (let i: number = 0; i < this._nRows; i++) {
            // generates the GridWords from rows and columns
            words = words.concat(this.generateEmptyWords(this._grid[i], i, Direction.HORIZONTAL));
            words = words.concat(this.generateEmptyWords(this.getColumn(i), i, Direction.VERTICAL));
        }

        return words;
    }

    private initializeGrid(): void {
        this._grid = [];
        for (let i: number = 0; i < this._nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < this._nColumns; j++) {
                row.push(WHITE_CELL);
            }
            this._grid.push(row);
        }
    }

    private generateEmptyWords(lane: string[], index: number, direction: Direction): GridWord[] {
        const emptyWords: GridWord[] = [];
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CELL) {
                continue;
            }
            let value: string = "";
            const headIndex: number = i;
            for (; i < lane.length; i++) {
                value += "-";
                if (lane[i] === BLACK_CELL) {
                    i--;
                    break;
                }
            }
            if (value.length < MIN_WORD_LENGTH) {
                continue;
            }
            let row: number, column: number;
            if (direction === Direction.HORIZONTAL) {
                row = index;
                column = headIndex;
            } else {
                row = headIndex;
                column = index;
            }
            emptyWords.push(new GridWord(row, column, direction, value));
        }

        return emptyWords;
    }

    private placeBlackCells(nBlackCells: number): void {
        this.setRandomly(BLACK_CELL, nBlackCells);
    }

    private set(row: number, col: number, value: string): void {
        if (value.length !== 1 ||
            (row >= this._nRows || row < 0 || col >= this._nColumns || col < 0)) {
            throw new RangeError;
        }
        this._grid[row][col] = value;
    }

    private setRandomly(value: string, n: number = 1): void {
        if (value.length !== 1) {
            return;
        }

        for (; n > 0; n--) {
            let row: number;
            let column: number;
            do {
                const id: number = Math.floor(Math.random() * (this._nColumns * this._nRows) );
                row = Math.floor(id / this._nRows);
                column = id - row * this._nRows;
            } while (this._grid[row][column] === value);
            this.set(row, column, value);
        }
    }

    private fixLoneCell (row: number, col: number): void {
        if (!this.isLoneCell(row, col)) {
            return;
        }
        this._grid[row][col] = BLACK_CELL;
        // shifts a black cell up unless at the bottom of the grid, then left or right.
        if (row < this._nRows - 1) {
            this._grid[row + 1][col] = WHITE_CELL;
        } else if (col > 0) {
            this._grid[row][col + 1] = WHITE_CELL;
        } else {
            this._grid[row][col - 1] = WHITE_CELL;
        }
    }

    private fixNoWords(lane: string[]): number {
        let nRemovedBlackCells: number = 0;
        while (!this.hasWords(lane)) {
            const i: number = Math.floor(Math.random() * lane.length);
            if (lane[i] === BLACK_CELL) {
                nRemovedBlackCells++;
                lane[i] = WHITE_CELL;
            }
        }

        return nRemovedBlackCells;
    }

    // creates an array representing the column at the specified index.
    private getColumn(index: number): string[] {
        if (index < 0 || index >= this._nColumns) {
            return null;
        }
        const column: string[] = [];
        for (let row: number = 0; row < this._nRows; row++) {
            column.push(this._grid[row][index]);
        }

        return column;
    }

    private isLoneCell(row: number, col: number): boolean {
        if (this._grid[row][col] === BLACK_CELL) {
            return false;
        }

        return !((row > 0 && (this._grid[row - 1][col] === WHITE_CELL)) ||
                (row < this._nRows - 1 && (this._grid[row + 1][col] === WHITE_CELL)) ||
                (col > 0 && (this._grid[row][col - 1] === WHITE_CELL)) ||
                (col < this._nColumns - 1 && (this._grid[row][col + 1] === WHITE_CELL)));
    }

    private hasWords(lane: string[]): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this._nColumns; i++) {
            if (lane[i] === BLACK_CELL) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return true;
            }
        }

        return false;
    }
}
