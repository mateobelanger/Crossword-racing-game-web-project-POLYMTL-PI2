import { Word } from "./word";

export const MIN_WORD_LENGTH: number = 2;
export const DEFAULT_GRID_SIZE: number = 10;

export const BLACK_CASE: string = "#";
export const WHITE_CASE: string = "-";

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private _grid: string[][];

    public constructor() {
        this._grid = [];
    }

    public generate(nRows: number = DEFAULT_GRID_SIZE,
                    nColumns: number = DEFAULT_GRID_SIZE,
                    nBlackCases: number): Word[] {

        this.initialize(nRows, nColumns);
        this.fill(nBlackCases);
        this.fix();

        let words: Word[] = [];
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = this._grid[i];
            words = words.concat(this.generateWords(row, i, "horizontal"));
        }
        for (let i: number = 0; i < this.nColumns; i++) {
            const column: string[] = this.getColumn(i);
            words = words.concat(this.generateWords(column, i, "vertical"));
        }
        // descending order.
        words.sort( (word1: Word, word2: Word) => {
            return word2.size - word1.size;
        });

        return words;
    }

    public get grid(): string[][] {
        return this._grid;
    }

    private initialize(nRows: number, nCols: number): void {
        this.nRows = nRows;
        this.nColumns = nCols;

        for (let i: number = 0; i < nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < nCols; j++) {
                row.push(WHITE_CASE);
            }
            this._grid.push(row);
        }
    }

    private fix(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this.isLoneCase(i, j)) {
                    this.fixLoneCase(i, j);
                    i = 0; j = 0;
                }
            }
            const row: string[] = this._grid[i];

            if (!this.hasWords(row)) {
                this.addWord(row);
                this.setRandomly(BLACK_CASE);
                i = 0;
            }

            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                this.addWord(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[i][j] = column[j];
                }
            }

        }
    }

    private set(row: number, col: number, value: string): void {
        if (value.length > 1) {
            return;
        }
        if (row >= this.nRows || row < 0) {
            return;
        }
        if (col >= this.nColumns || col < 0) {
            return;
        }
        this._grid[row][col] = value;
    }

    private setRandomly(value: string): void {
        if (value.length > 1) {
            return;
        }
        let column: number = 0;
        let row: number = 0;
        do {
            row = Math.floor(Math.random() * this.nRows);
            column = Math.floor(Math.random() * this.nColumns);
        } while (this.isCorner(row, column) || this._grid[row][column] === value);

        this.set(row, column, value);
    }

    // creates an array representing the column at the specified index.
    private getColumn(index: number): string[] {
        if (index < 0 || index >= this.nColumns) {
            return null;
        }
        const column: string[] = [];
        for (let row: number = 0; row < this.nRows; row++) {
            column.push(this._grid[row][index]);
        }

        return column;
    }

    private fill(nBlackCases: number): void {
        for (let i: number = 0; i < nBlackCases; i++) {
            this.setRandomly(BLACK_CASE);
        }
    }

    private isCorner(row: number, col: number): boolean {
        if ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH)
            && (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH)) {
            return true;
        }

        return false;
    }

    // Returns true if a white case is surrounded by black cases.
    private isLoneCase(row: number, col: number): boolean {
        if (this._grid[row][col] === BLACK_CASE) {
            return false;
        }
        if (row > 0 && (this._grid[row - 1][col] === WHITE_CASE)) {
            return false;
        } else if (row < this.nRows - 1 && (this._grid[row + 1][col] === WHITE_CASE)) {
            return false;
        } else if (col > 0 && (this._grid[row][col - 1] === WHITE_CASE)) {
            return false;
        } else if (col < this.nColumns - 1 && (this._grid[row][col + 1] === WHITE_CASE)) {
            return false;
        }

        return true;
    }

    private fixLoneCase (row: number, col: number): void {
        if (!this.isLoneCase(row, col)) {
            return;
        }
        // shifts a black case up or left depending on the position.
        this._grid[row][col] = BLACK_CASE;
        if (col === this.nColumns - 1) {
            this._grid[row + 1][col] = WHITE_CASE;
        } else {
            this._grid[row][col + 1] = WHITE_CASE;
        }
    }

    // returns whether a row or col has words or no words in it.
    private hasWords(lane: string[]): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nColumns; i++) {
            if (lane[i] === BLACK_CASE) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return true;
            }
        }

        return false;
    }

    private addWord(lane: string[]): void {
        let noWhiteCase: boolean = true;
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            noWhiteCase = false;
            if (i > 0) {
                lane[i - 1] = WHITE_CASE;
            } else {
                lane[i + 1] = WHITE_CASE;
            }
            break;
        }
        if (noWhiteCase) {
            const index: number = Math.floor(Math.random() * lane.length - 1);
            lane[index] = WHITE_CASE;
            lane[index + 1] = WHITE_CASE;

            return;
        }
    }

    private generateWords(lane: string[], index: number, direction: string): Word[] {
        const result: Word[] = [];
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            const word: Word = new Word();
            if (direction === "horizontal") {
                word.row = index;
                word.column = i;
            } else {
                word.row = i;
                word.column = index;
            }
            word.direction = direction;

            let length: number = 0;
            while (lane[i] === WHITE_CASE) {
                length++;
                if (++i >= lane.length) {
                    break;
                }
            }
            if (length >= MIN_WORD_LENGTH) {
                word.size = length;
                result.push(word);
            }
        }

        return result;
    }
}
