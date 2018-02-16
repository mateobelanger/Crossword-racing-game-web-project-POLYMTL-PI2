import { Response } from "express";
import { Word, GridEntry, HORIZONTAL, VERTICAL } from "./word";

const requestPromise = require("request-promise-native");

export const MIN_WORD_LENGTH: number = 2;
export const DEFAULT_GRID_SIZE: number = 5;
export const BLACK_CASE: string = "#";
export const WHITE_CASE: string = "-";

export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private _grid: string[][];
    private cacheWords: Map<string,JSON> = new Map();

    public constructor() {
        this._grid = [];
        this.nRows = DEFAULT_GRID_SIZE;
        this.nColumns = DEFAULT_GRID_SIZE;

    }

    public generate(nBlackCases: number,
                    difficulty: string): GridEntry[] {
        this.initialize(this.nRows, this.nColumns);
        this.placeBlackCases(nBlackCases);
        this.fixIssues();

        let wordsToFill: GridEntry[] = [];
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = this._grid[i];
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(row, i, HORIZONTAL));
            const column: string[] = this.getColumn(i);
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(column, i, VERTICAL));
        }
        wordsToFill.sort((entry1: GridEntry, entry2: GridEntry) => {
            return entry1.word.size - entry2.word.size;
        }); 
        
        return wordsToFill;
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

    private placeBlackCases(nBlackCases: number): void {
        for (let i: number = 0; i < nBlackCases; i++) {
            this.setRandomly(BLACK_CASE);
        }
    }

    private fixIssues(): void {
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
                    this._grid[j][i] = column[j];
                }
                this.setRandomly(BLACK_CASE);
                i = 0;
            }
        }
    }
 
    public async placeWords(wordsToFill: GridEntry[], filledWords: GridEntry[], difficulty: string,
                            lastTemplate: string, res: Response): Promise<boolean> {
        if (wordsToFill.length === 0) {
            res.send(filledWords);
            console.log("DONE!");
            return true;
        }
        filledWords.push(wordsToFill.pop());
        const wordTemplate: string = this.createTemplate(filledWords[filledWords.length - 1].word);
        try {
            const results: JSON = await this.getWords(wordTemplate, difficulty);
            if(Object.keys(results).length === 0) {
                return false;
            }
            for (let i: number = 0; i < Object.keys(results).length; i++) {
                if (this.contains(results[i].name, filledWords)) {
                    continue;
                }
                const addedEntry = filledWords[filledWords.length -1];
                addedEntry.word.value = results[i].name;
                addedEntry.word.definition = results[i].definitions[results[i].definitionIndex];
                this.updateGrid(filledWords);
                this.updateWeights(wordsToFill, filledWords);
                filledWords.sort((entry1: GridEntry, entry2: GridEntry) => {
                    return entry1.weight - entry2.weight;
                });
                if (await this.placeWords(wordsToFill, filledWords, difficulty, wordTemplate, res)) {
                    console.log(this._grid);
                    return true;
                }
            }
            
            const lastEntry: GridEntry = filledWords.pop();
            if (lastEntry !== undefined) {
                lastEntry.word.value = lastTemplate;
                wordsToFill.push(lastEntry);
                this.updateGrid(wordsToFill);
                this.updateWeights(wordsToFill, filledWords);
            }

            return false;
        }
        catch (e){
            return false;
        }   
    }

    private createTemplate(word: Word): string {
        let template: string = "";
        for (let i: number = 0; i < word.size; i++) {
            if (word.direction === HORIZONTAL) {
                template += this._grid[word.row][word.column + i];
            } else {
                template += this._grid[word.row + i][word.column];
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
                if (entry.word.direction === HORIZONTAL) {
                    this._grid[entry.word.row][entry.word.column + i] = entry.word.value[i];
                } else {
                    this._grid[entry.word.row + i][entry.word.column] = entry.word.value[i];
                }
            }
        }        
        console.log(this.grid);
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

    private generateEmptyWords(lane: string[], index: number, direction: string): GridEntry[] {
        const result: GridEntry[] = [];
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            const word: Word = new Word();
            if (direction === HORIZONTAL) {
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
                result.push(new GridEntry(word));
            }
        }

        return result;
    }

    private async getWords(wordSkeleton: string, difficulty: string): Promise<JSON> {
        if (this.cacheWords.has(wordSkeleton)) {
            return this.cacheWords.get(wordSkeleton);
        }
        const url: String = "http://localhost:3000/service/lexical/wordsearch/" + wordSkeleton + "/" + difficulty;
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            json: true, uri: url
          };
        try {
            const possibleWords: JSON = await requestPromise(options);
            this.cacheWords.set(wordSkeleton, possibleWords);
            return possibleWords;
        } catch (error) {
            return Promise.reject(error);
        }
    }

}
