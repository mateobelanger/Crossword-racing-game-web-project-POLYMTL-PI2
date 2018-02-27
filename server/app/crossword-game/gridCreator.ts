import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";

export const MIN_WORD_LENGTH: number = 3;
export const DEFAULT_GRID_SIZE: number = 4;
export const BLACK_CELL: string = "#";
export const WHITE_CELL: string = "-";

export class GridCreator {
    private _nRows: number;
    private _nColumns: number;
    private _grid: string[][];

    public constructor() {
        this._nRows = DEFAULT_GRID_SIZE;
        this._nColumns = DEFAULT_GRID_SIZE;
        this._grid = [];
        // initialize empty 2D array of correct dimensions.
        for (let i: number = 0; i < this._nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < this._nColumns; j++) {
                row.push(WHITE_CELL);
            }
            this._grid.push(row);
        }
    }

    public get grid(): string[][] {
        return this._grid;
    }

    public create(nBlackCells: number): GridWord[] {
        this.placeBlackCells(nBlackCells);
        this.fixCellsLayout();

        return this.generateGridStructure();
    }

    private fixCellsLayout(): void {
        for (let i: number = 0; i < this._nRows; i++) {
            for (let j: number = 0; j < this._nColumns; j++) {
                if (this.isLoneCell(i, j)) {
                    this.fixLoneCell(i, j);
                    i = 0; j = 0;
                }
            }

            const row: string[] = this._grid[i];
            let nRemovedBlackCells: number = 0;
            if (!this.hasWords(row)) {
                nRemovedBlackCells += this.fixNoWords(row);
                i = 0;
            }
            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                nRemovedBlackCells += this.fixNoWords(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[j][i] = column[j];
                }
                i = 0;
            }
            this.setRandomly(BLACK_CELL, nRemovedBlackCells);
        }
    }

    private generateGridStructure(): GridWord[] {
        let wordsToFill: GridWord[] = [];
        for (let i: number = 0; i < this._nRows; i++) {
            // generates the GridWords from rows and columns
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(this._grid[i], i, Direction.HORIZONTAL));
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(this.getColumn(i), i, Direction.VERTICAL));
        }

        return wordsToFill;
    }

    private generateEmptyWords(lane: string[], index: number, direction: Direction): GridWord[] {
        const emptyWords: GridWord[] = [];
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CELL) {
                continue;
            }

            const headIndex: number = i;
            let value: string = "";
            while (lane[i] === WHITE_CELL) {
                value += lane[i];
                if (++i >= lane.length) {
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
            return;
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
        // shifts a black case up or left depending on the position.
        this._grid[row][col] = BLACK_CELL;
        if (col === this._nColumns - 1) {
            this._grid[row + 1][col] = WHITE_CELL;
        } else {
            this._grid[row][col + 1] = WHITE_CELL;
        }
    }

    private fixNoWords(lane: string[]): number {
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CELL) {
                continue;
            }

            let nRemovedBlackCells: number = 0;
            for (let j: number = 1; j < MIN_WORD_LENGTH; j++) {
                if (i >= MIN_WORD_LENGTH - 1) {
                    if (lane[i - j] === BLACK_CELL) { nRemovedBlackCells ++; }
                    lane[i - j] = WHITE_CELL;
                } else {
                    if (lane[i + j] === BLACK_CELL) { nRemovedBlackCells ++; }
                    lane[i + j] = WHITE_CELL;
                }
            }

            return nRemovedBlackCells;
        }
        // if the whole lane was black cells.
        lane[Math.floor(Math.random() * lane.length)] = WHITE_CELL;

        return this.fixNoWords(lane) + 1;
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

        return !(row > 0 && (this._grid[row - 1][col] === WHITE_CELL) ||
                row < this._nRows - 1 && (this._grid[row + 1][col] === WHITE_CELL) ||
                col > 0 && (this._grid[row][col - 1] === WHITE_CELL) ||
                col < this._nColumns - 1 && (this._grid[row][col + 1] === WHITE_CELL));
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
