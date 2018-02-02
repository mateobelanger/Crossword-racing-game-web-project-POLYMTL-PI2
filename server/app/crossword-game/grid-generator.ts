import { Word } from "./word";

export const MIN_WORD_LENGTH: number = 2;
export const DEFAULT_GRID_SIZE: number = 10;

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private isBlackCase: boolean[][];

    public constructor() {
        this.isBlackCase = [];
    }

    public generate(nRows: number = DEFAULT_GRID_SIZE,
                    nColumns: number = DEFAULT_GRID_SIZE,
                    nBlackCases: number): Word[] {

        this.initialize(nRows, nColumns);
        this.fill(nBlackCases);
        this.fix();

        return this.generateHorizontalWords().concat(this.generateVerticalWords());
    }

    public initialize(nRows: number, nCols: number): void {
        this.nRows = nRows;
        this.nColumns = nCols;

        for (let i: number = 0; i < nRows; i++) {
            const row: boolean[] = [];
            for (let j: number = 0; j < nCols; j++) {
                row.push(false);
            }
            this.isBlackCase.push(row);
        }
    }

    private fix(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this.isLoneCase(i, j)) {
                    this.fixLoneCase(i, j);
                    i = 0; j = 0;
                }
                if (this.isRowWithoutWords(i)) {
                    this.addWordToRow(i);
                    i = 0; j = 0;
                }
                if (this.isColumnWithoutWords(j)) {
                    this.addWordToColumn(j);
                    i = 0; j = 0;
                }
            }
        }
    }

    private set(row: number, col: number, value: boolean): void {
        if (row >= this.nRows || row < 0) {
            return;
        }
        if (col >= this.nColumns || col < 0) {
            return;
        }

        this.isBlackCase[row][col] = value;
    }

    public setRandomly(value: boolean): void {
        let column: number;
        let row: number;
        do {
            row = Math.floor(Math.random() * this.nRows);
            column = Math.floor(Math.random() * this.nColumns);
            if (this.isCorner(row, column)) {
                continue;
            }
        } while (this.isBlackCase[row][column] === value);

        this.set(row, column, value);
    }

    private isCorner(row: number, col: number): boolean {
        if ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH)
        && (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH)) {
            return true;
        }

        return false;
    }

    private fill(nBlackCases: number): void {
        for (let i: number = 0; i < nBlackCases; i++) {
            this.setRandomly(true);
        }
    }

    // Returns true if a white case is surrounded by black cases.
    private isLoneCase(row: number, col: number): boolean {
        if (this.isBlackCase[row][col] === true) {
            return false;
        }
        if (row > 0 && (this.isBlackCase[row - 1][col] === false)) {
            return false;
        }
        if (row < this.nRows - 1 && (this.isBlackCase[row + 1][col] === false)) {
            return false;
        }
        if (col > 0 && (this.isBlackCase[row][col - 1] === false)) {
            return false;
        }
        if (col < this.nRows - 1 && (this.isBlackCase[row][col + 1] === false)) {
            return false;
        }

        return true;
    }

    // fixes the lone case at position [row, col].
    private fixLoneCase (row: number, col: number): void {
        if (!this.isLoneCase(row, col)) {
            return;
        }
        // shifts a black case up or left depending on the position.
        this.isBlackCase[row][col] = true;
        if (col === this.nColumns - 1) {
            this.isBlackCase[row + 1][col] = false;
        } else {
            this.isBlackCase[row][col + 1] = false;
        }
    }

    private isRowWithoutWords(row: number): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nColumns; i++) {
            if (this.isBlackCase[row][i]) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return false;
            }
        }

        return true;
    }

    private isColumnWithoutWords(column: number): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nRows; i++) {
            if (this.isBlackCase[i][column]) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return false;
            }
        }

        return true;
    }

    private addWordToRow(row: number): void {
        let noWhiteCase: boolean = true;
        for (let i: number = row; i < this.nColumns; i++) {
            if (this.isBlackCase[row][i]) {
                continue;
            }
            noWhiteCase = false;
            if (i > 0) {
                this.set(row, --i, false);
            } else {
                this.set(row, ++i, false);
            }
            break;
        }
        if (noWhiteCase) {
            const column: number = Math.floor(Math.random() * this.nColumns - 1);
            this.set(row, column, false);
            this.set(row, column + 1, false);
            this.setRandomly(true);
            this.setRandomly(true);

            return;
        }
        this.setRandomly(true);
    }

    private addWordToColumn(column: number): void {
        let noWhiteCase: boolean = true;
        for (let i: number = column; i < this.nColumns; i++) {
            if (this.isBlackCase[i][column]) {
                continue;
            }
            noWhiteCase = false;
            if (i > 0) {
                this.set(--i, column, false);
            } else {
                this.set(++i, column, false);
            }
            break;
        }
        if (noWhiteCase) {
            const row: number = Math.floor(Math.random() * this.nRows - 1);
            this.set(row, column, false);
            this.set(row + 1, column, false);
            this.setRandomly(true);
            this.setRandomly(true);

            return;
        }
        this.setRandomly(true);
    }

    private generateHorizontalWords(): Word[] {
        const result: Word[] = [];
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this.isBlackCase[i][j] === true) {
                    continue;
                }
                const word: Word = new Word();
                word.row = i;
                word.column = j;
                word.direction = "horizontal";

                let length: number = 0;
                while (this.isBlackCase[i][j] !== true) {
                    length++;
                    if (++j >= this.nColumns) {
                        break;
                    }
                }
                if (length >= MIN_WORD_LENGTH) {
                    word.size = length;
                    result.push(word);
                }
            }
        }

        return result;
    }

    private generateVerticalWords(): Word[] {
        const result: Word[] = [];
        for (let i: number = 0; i < this.nColumns; i++) {
            for (let j: number = 0; j < this.nRows; j++) {
                if (this.isBlackCase[j][i] === true) {
                    continue;
                }
                const word: Word = new Word();
                word.row = j;
                word.column = i;
                word.direction = "vertical";

                let length: number = 0;
                while (this.isBlackCase[j][i] !== true) {
                    length++;
                    if (++j >= this.nRows) {
                        break;
                    }
                }
                if (length >= MIN_WORD_LENGTH) {
                    word.size = length;
                    result.push(word);
                }
            }
        }

        return result;
    }

    // for tests. to be removed.
    public get grid(): boolean[][] {
        return this.isBlackCase;
    }
}
