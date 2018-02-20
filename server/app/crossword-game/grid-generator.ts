import { Response } from "express";
import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";
import { GridEntry } from "./GridEntry";
import { WordSelector } from "../lexicalService/wordSelector";

export const MIN_WORD_LENGTH: number = 3;
export const DEFAULT_GRID_SIZE: number = 3;
export const BLACK_CASE: string = "#";
export const WHITE_CASE: string = "-";

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private _grid: string[][];

    public constructor() {
        this._grid = [];
        this.nRows = DEFAULT_GRID_SIZE;
        this.nColumns = DEFAULT_GRID_SIZE;
    }

    public generate(nBlackCells: number,
                    difficulty: string): GridEntry[] {
        this.initialize();
        this.placeBlackCells(nBlackCells);
        this.fixIssues();

        let wordsToFill: Array<GridEntry> = new Array<GridEntry>();
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = this._grid[i];
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(row, i, Direction.HORIZONTAL));
            const column: string[] = this.getColumn(i);
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(column, i, Direction.VERTICAL));
        }
        wordsToFill.sort((entry1: GridEntry, entry2: GridEntry) => {
            return entry1.word.value.length - entry2.word.value.length;
        });

        return wordsToFill;
    }

    public get grid(): string[][] {
        return this._grid;
        }

    private initialize(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < this.nColumns; j++) {
                row.push(WHITE_CASE);
            }
            this._grid.push(row);
        }
    }

    private set(row: number, col: number, value: string): void {
        if (value.length !== 1) {
            return;
        }
        if (row >= this.nRows || row < 0 || col >= this.nColumns || col < 0) {
            return;
        }
        this._grid[row][col] = value;
    }

    private setRandomly(value: string): void {
        if (value.length !== 1) {
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

    private placeBlackCells(nBlackCells: number): void {
        for (let i: number = 0; i < nBlackCells; i++) {
            this.setRandomly(BLACK_CASE);
        }
    }

    private fixIssues(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this.isLoneCell(i, j)) {
                    this.fixLoneCell(i, j);
                    i = 0; j = 0;
                }
            }
            const row: string[] = this._grid[i];
            if (!this.hasWords(row)) {
                this.fixNoWord(row);
                this.setRandomly(BLACK_CASE);
                i = 0;
            }
            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                this.fixNoWord(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[j][i] = column[j];
                }
                this.setRandomly(BLACK_CASE);
                i = 0;
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    public async placeWords(wordsToFill: GridEntry[], filledWords: GridEntry[], difficulty: string,
                            lastTemplate: string, res: Response): Promise<boolean> {
        if (wordsToFill.length === 0) {
            res.send(filledWords);

            return true;
        }
        const currentWord: GridEntry = wordsToFill.pop();
        const wordTemplate: string = this.createTemplate(currentWord);
        try {
            const results: Array<string> = await WordSelector.getWords(wordTemplate);
            console.log(results);
            if (Object.keys(results).length === 0) {
                wordsToFill.push(currentWord);

                return false;
            }
            for (let i: number = 0; i < Object.keys(results).length; i++) {
                if (this.contains(results[i], filledWords)) {
                    continue;
                }
                currentWord.word.value = results[i];
                filledWords.push(currentWord);
                await this.updateGrid(filledWords);
                await this.updateWeights(wordsToFill, filledWords);
                filledWords.sort((entry1: GridEntry, entry2: GridEntry) => {
                    return entry1.weight - entry2.weight;
                });
                if (await this.placeWords(wordsToFill, filledWords, difficulty, wordTemplate, res)) {
                    return true;
                } else {
                    filledWords.pop();
                }
            }
            await wordsToFill.push(currentWord);
            await this.updateGrid(filledWords);

            return false;
        } catch (e) {
            return false;
        }
    }

    private createTemplate(gridEntry: GridEntry): string {
        let template: string = "";
        for (let i: number = 0; i < gridEntry.word.value.length; i++) {
            if (gridEntry.word.direction === Direction.HORIZONTAL) {
                template += this._grid[gridEntry.word.row][gridEntry.word.column + i];
            } else {
                template += this._grid[gridEntry.word.row + i][gridEntry.word.column];
            }
        }
        return template;
    }

    private updateGrid(filledWords: GridEntry[]): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this._grid[i][j] !== BLACK_CASE) {
                    this.grid[i][j] = WHITE_CASE;
                }
            }
        }
        for (const entry of filledWords) {
            for (let i: number = 0; i < entry.word.value.length; i++) {
                if (entry.word.direction === Direction.HORIZONTAL) {
                    this._grid[entry.word.row][entry.word.column + i] = entry.word.value[i];
                } else {
                    this._grid[entry.word.row + i][entry.word.column] = entry.word.value[i];
                }
            }
        }
    }

    private updateWeights(empty: GridEntry[], filled: GridEntry[]): void {
        for (const entry of empty) {
            entry.weight = 0;
        }
        for (const word of filled) {
            for (const entry of empty) {
                if (entry.crosses(word)) {
                    entry.weight++;
                }
            }
        }
    }

    private contains(word: string, entries: GridEntry[]): boolean {
        for (const w of entries) {
            if (w.word.value === word) {
                return true;
            }
        }

        return false;
    }

    private isCorner(row: number, col: number): boolean {
        return ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH)
            && (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH));
    }

    private isLoneCell(row: number, col: number): boolean {
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

    private fixLoneCell (row: number, col: number): void {
        if (!this.isLoneCell(row, col)) {
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

    private fixNoWord(lane: string[]): void {
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            if (i > 0) {
                lane[i - 1] = WHITE_CASE;
            } else {
                lane[i + 1] = WHITE_CASE;
            }
            break;
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private generateEmptyWords(lane: string[], index: number, direction: Direction): Array<GridEntry> {
        const result: Array<GridEntry> = new Array<GridEntry>();
        let row: number;
        let column: number;
        let wordDirection: Direction;
        let value: string = "";
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) { continue; }
            if (direction === Direction.HORIZONTAL) {
                row = index;
                column = i;
            } else {
                row = i;
                column = index;
            }
            wordDirection = direction;
            let length: number = 0;
            value = "";
            while (lane[i] === WHITE_CASE) {
                length++;
                value += " ";
                if (++i >= lane.length) {
                    break;
                }
            }
            if (length >= MIN_WORD_LENGTH) {
                result.push(new GridEntry(new GridWord(row, column, wordDirection, value)));
            }
        }

        return result;
    }
}
