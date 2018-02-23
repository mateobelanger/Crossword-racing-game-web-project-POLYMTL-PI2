import { Response } from "express";
import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";
import { GridEntry } from "./GridEntry";
import { WordSelector } from "../lexicalService/wordSelector";

export const MIN_WORD_LENGTH: number = 3;
export const DEFAULT_GRID_SIZE: number = 5;
export const BLACK_CELL: string = "#";
export const WHITE_CELL: string = "-";

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private _grid: string[][];

    public constructor() {
        this._grid = [];
        this.nRows = DEFAULT_GRID_SIZE;
        this.nColumns = DEFAULT_GRID_SIZE;
    }

    public get grid(): string[][] {
        return this._grid;
    }

    public generate(nBlackCells: number,
                    difficulty: string): GridEntry[] {
        this.initialize();
        this.placeBlackCells(nBlackCells);
        this.fixIssues();

        let wordsToFill: GridEntry[] = [];
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

    // tslint:disable-next-line:max-func-body-length
    public async placeWords(wordsToFill: GridEntry[], filledWords: GridEntry[], 
                            difficulty: string, res: Response): Promise<boolean> {

        if (wordsToFill.length === 0) {
            res.send(filledWords);
            return true;
        }
        const current: GridEntry = wordsToFill.pop();
        const template: string = this.createTemplate(current);
   
        const results: Array<string> = await WordSelector.getWords(template);
        for (let i: number = 0; i < Object.keys(results).length; i++) {
            if (this.contains(results[i], filledWords)) {
                continue;
            }
            current.word.value = results[i];
            filledWords.push(current);
            this.updateGrid(filledWords);
            this.updateWeights(wordsToFill, filledWords);
            
            filledWords.sort((entry1: GridEntry, entry2: GridEntry) => {
                return entry1.weight - entry2.weight;
            });

            if (await this.placeWords(wordsToFill, filledWords, difficulty, res)) {
                return true;
            } else {
                filledWords.pop();
            }
        }
        wordsToFill.push(current);
        this.updateGrid(filledWords);

        return false;
    }

    private initialize(): void {
        this._grid = [];
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < this.nColumns; j++) {
                row.push(WHITE_CELL);
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

    private setRandomly(value: string, n: number = 1): void {
        if (value.length !== 1) {
            return;
        }
        
        for (; n > 0; n--){
            let row: number;
            let column: number;
            do {
                const id = Math.floor(Math.random() * (this.nColumns * this.nRows) );
                row = Math.floor(id / this.nRows);
                column = id - row * this.nRows;
                console.log(id);
                console.log(row);
                console.log(column);
            } while (this.isCorner(row, column) || this._grid[row][column] === value);
            this.set(row, column, value);
        }
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
        if (nBlackCells > this.nRows * this.nColumns - 4 * MIN_WORD_LENGTH * MIN_WORD_LENGTH) {
            nBlackCells = nBlackCells;
        }
        this.setRandomly(BLACK_CELL, nBlackCells);
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
            let nRemovedBlackCells: number;
            if (!this.hasWords(row)) {
                nRemovedBlackCells = this.fixNoWord(row);
                this.setRandomly(BLACK_CELL, nRemovedBlackCells);
                i = 0;
            }
            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                nRemovedBlackCells = this.fixNoWord(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[j][i] = column[j];
                }
                this.setRandomly(BLACK_CELL, nRemovedBlackCells);
                i = 0;
            }
        }
    }

    private createTemplate(entry: GridEntry): string {
        let template: string = "";
        for (let i: number = 0; i < entry.word.value.length; i++) {
            if (entry.word.direction === Direction.HORIZONTAL) {
                template += this._grid[entry.word.row][entry.word.column + i];
            } else {
                template += this._grid[entry.word.row + i][entry.word.column];
            }
        }
        
        return template;
    }

    private updateGrid(filledWords: GridEntry[]): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this._grid[i][j] !== BLACK_CELL) {
                    this.grid[i][j] = WHITE_CELL;
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
        return false;
        /*return ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH) &&
                (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH));*/
    }

    private isLoneCell(row: number, col: number): boolean {
        if (this._grid[row][col] === BLACK_CELL) {
            return false;
        }
        return !(row > 0 && (this._grid[row - 1][col] === WHITE_CELL) ||
                row < this.nRows - 1 && (this._grid[row + 1][col] === WHITE_CELL) ||
                col > 0 && (this._grid[row][col - 1] === WHITE_CELL) ||
                col < this.nColumns - 1 && (this._grid[row][col + 1] === WHITE_CELL));
    }

    private fixLoneCell (row: number, col: number): void {
        if (!this.isLoneCell(row, col)) {
            return;
        }
        // shifts a black case up or left depending on the position.
        this._grid[row][col] = BLACK_CELL;
        if (col === this.nColumns - 1) {
            this._grid[row + 1][col] = WHITE_CELL;
        } else {
            this._grid[row][col + 1] = WHITE_CELL;
        }
    }

    private hasWords(lane: string[]): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nColumns; i++) {
            if (lane[i] === BLACK_CELL) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return true;
            }
        }

        return false;
    }

    private fixNoWord(lane: string[]): number {
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

        return 1 + this.fixNoWord(lane);
    }

    private generateEmptyWords(lane: string[], index: number, direction: Direction): Array<GridEntry> {
        const emptyWords: Array<GridEntry> = [];
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
            emptyWords.push(new GridEntry(new GridWord(row, column, direction, value)));
        }

        return emptyWords;
    }
}
