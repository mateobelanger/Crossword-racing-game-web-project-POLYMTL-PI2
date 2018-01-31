import { Word } from "./word";

export const MIN_WORD_LENGTH: number = 2;
export const DEFAULT_GRID_SIZE: number = 10;

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private blackCases: boolean[][];

    public constructor() {
        this.blackCases = [];
    }

    public generate(nRows: number = DEFAULT_GRID_SIZE,
                    nColumns: number = DEFAULT_GRID_SIZE,
                    nBlackCases: number): Word[] {

        this.initialize(nRows, nColumns);
        this.spreadRandomly(this.fill(nBlackCases));

        this.fix();

        const horizontalWords: Word[] = this.generateHorizontalWords();
        const verticalWords: Word[] = this.generateVerticalWords();

        return horizontalWords.concat(verticalWords);
    }

    private initialize(nRows: number, nCols: number): void {
        this.nRows = nRows;
        this.nColumns = nCols;

        for (let i: number = 0; i < nRows; i++) {
            const row: boolean[] = [];
            for (let j: number = 0; j < nCols; j++) {
                row.push(false);
            }
            this.blackCases.push(row);
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

        this.blackCases[row][col] = value;
    }

    private setRandomly(value: boolean): void {
        let column: number;
        let row: number;
        do {
            row = Math.floor(Math.random() * this.nRows);
            column = Math.floor(Math.random() * this.nColumns);
            if (this.isCorner(row, column)) {
                continue;
            }
        } while (this.blackCases[column][row] === value);

        this.set(row, column, value);
    }

    private isCorner(row: number, col: number): boolean {
        if ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH)
        && (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH)) {
            return true;
        }

        return false;
    }

    // fills the first n cases of the grid.
    private fill(nBlackCases: number): [number, number] [] {
        const blackCasesPosition: [number, number][] = [];    // array of pairs

        if (nBlackCases <= 0) {
            return blackCasesPosition;
        }

        // Reservoir-sampling-inspired algorithm to place black cases randomly
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {

                // ignores corners to prevent words too short.
                if (this.isCorner(i, j)) {
                    continue;
                }
                this.set(i, j, true);
                blackCasesPosition.push([i, j]);

                if (blackCasesPosition.length === nBlackCases) {
                    return blackCasesPosition;
                }
            }
        }

        return blackCasesPosition;
    }

    private spreadRandomly(blackCasesPosition: [number, number][]): void {
        const nBlackCases: number = blackCasesPosition.length;

        // get the position of the case after the last black case.
        let i: number = blackCasesPosition[nBlackCases - 1][0];
        let j: number = blackCasesPosition[nBlackCases - 1][1] + 1;

        for (; i < this.nRows; i++) {
            for (; j < this.nColumns; j++) {
                if (this.isCorner(i, j)) {
                    continue;
                }
                const range: number = i * this.nColumns + j;
                const seed: number = Math.floor(Math.random() * range);
                if (seed < nBlackCases) {
                    const ROW: number = blackCasesPosition[seed][0];
                    const COLUMN: number = blackCasesPosition[seed][1];
                    this.set(ROW, COLUMN, false);

                    blackCasesPosition[seed] = [i, j];
                    this.set(i, j, true);
                }
            }
            j = 0;
        }
    }

    // Returns true if a white case is surrounded by black cases.
    private isLoneCase(row: number, col: number): boolean {
        if (this.blackCases[row][col] === true) {
            return false;
        }
        if (row > 0 && (this.blackCases[row - 1][col] === false)) {
            return false;
        }
        if (row < this.nRows - 1 && (this.blackCases[row + 1][col] === false)) {
            return false;
        }
        if (col > 0 && (this.blackCases[row][col - 1] === false)) {
            return false;
        }
        if (col < this.nRows - 1 && (this.blackCases[row][col + 1] === false)) {
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
        this.blackCases[row][col] = true;
        if (col === this.nColumns - 1) {
            this.blackCases[row + 1][col] = false;
        } else {
            this.blackCases[row][col + 1] = false;
        }
    }

    private isRowWithoutWords(row: number): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nColumns; i++) {
            if (this.blackCases[row][i]) {
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
            if (this.blackCases[i][column]) {
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
            if (this.blackCases[row][i]) {
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
            if (this.blackCases[i][column]) {
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
                if (this.blackCases[i][j] === true) {
                    continue;
                }
                const word: Word = new Word();
                word.row = i;
                word.column = j;
                word.direction = "horizontal";

                let length: number = 0;
                while (this.blackCases[i][j] !== true) {
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
                if (this.blackCases[j][i] === true) {
                    continue;
                }
                const word: Word = new Word();
                word.row = j;
                word.column = i;
                word.direction = "vertical";

                let length: number = 0;
                while (this.blackCases[j][i] !== true) {
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
        return this.blackCases;
    }

}
