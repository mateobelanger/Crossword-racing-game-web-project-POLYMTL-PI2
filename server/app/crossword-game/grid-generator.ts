import { Word } from "./word";

const requestPromise = require("request-promise-native");

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
        this.nRows = DEFAULT_GRID_SIZE;
        this.nColumns = DEFAULT_GRID_SIZE

    }

    public async generate(nBlackCases: number,
                          difficulty: string): Promise<Word[]> {
        this.initialize(this.nRows, this.nColumns);
        this.placeBlackCases(nBlackCases);
        this.fixIssues();

        let wordsToFill: Word[] = [];
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = this._grid[i];
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(row, i, "horizontal"));
            const column: string[] = this.getColumn(i);
            wordsToFill = wordsToFill.concat(this.generateEmptyWords(column, i, "vertical"));
        }
        /* wordsToFill.sort((word1: Word, word2: Word) => {
            return word1.size - word2.size;
        }); */
        const filledWords: Word[] = [];
 /*       
        wordsToFill[wordsToFill.length - 1].value = "abcde";
        this.updateGrid(wordsToFill[wordsToFill.length - 1]);
        console.log(this._grid);
*/

        await this.placeWords(wordsToFill, filledWords, difficulty, "");

        console.log(this._grid);
        return filledWords;
    }
    
    private async placeWords(wordsToFill: Word[], filledWords: Word[],
                             difficulty: string, lastTemplate: string): Promise<boolean> {
        if (wordsToFill.length === 0) {
            return true;
        }
        filledWords.push(wordsToFill.pop());
        const wordTemplate: string = this.createTemplate(filledWords[filledWords.length - 1]);
        try {
            const results: JSON = await this.getWords(wordTemplate, difficulty);
            for (let i: number = 0; i < Object.keys(results).length; i++) {
                        if (this.contains(results[i].name, filledWords)) {
                            continue;
                        }
                        filledWords[filledWords.length - 1].value = results[i].name;

                        console.log(results[i].name);

                        this.updateGrid(filledWords);
                        if (await this.placeWords(wordsToFill, filledWords, difficulty, wordTemplate)) {
                            return true;
                        }
            }
            
            const lastEntry: Word = filledWords.pop();
            if (lastEntry !== undefined) {
                lastEntry.value = lastTemplate;
                wordsToFill.push(lastEntry);
                this.updateGrid(filledWords);
                // console.log(this._grid);
            }

            //console.log("false")
            return false;
        }
        catch (e){
            console.log("error");
            return false;
        }
        

        //console.log(Object.keys(results).length);
        

    }

    private createTemplate(word: Word): string {
        let template: string = "";
        for (let i: number = 0; i < word.size; i++) {
            if (word.direction === "horizontal") {
                template += this._grid[word.row][word.column + i];
            } else {
                template += this._grid[word.row + i][word.column];
            }
        }

        console.log("template: " + template);
        return template;
    }

    private updateGrid(filledWords: Word[]): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this._grid[i][j] !== BLACK_CASE) {
                    this.grid[i][j] = WHITE_CASE;
                }
            }
        }
        for (const word of filledWords) {
            for (let i: number = 0; i < word.value.length; i++) {
                if (word.direction === "horizontal") {
                    this._grid[word.row][word.column + i] = word.value[i];
                } else {
                    this._grid[word.row + i][word.column] = word.value[i];
                }
            }
        }
        console.log(this._grid);
    }

    private contains(word: string, words: Word[]): boolean {
        for (const w of words) {
            if (w.value === word) {
                return true;
            }
        }

        return false;
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
/*
    private async placeWords(emptyWords: Word[], filledWords: Word[], difficulty: string): Promise<boolean> {
        if (emptyWords.length === 0) {
            return true;
        }
        filledWords.push(emptyWords.pop());
        const wordTemplate: string = this.createTemplate(filledWords[filledWords.length - 1]);
        const results: JSON = await this.getWords(wordTemplate, difficulty);
        for (let i: number = 0; i < Object.keys(results).length; i++) {
            if (this.contains(results[i], filledWords)) {
                continue;
            }
            filledWords[filledWords.length - 1].value = results[i].name;
            this.updateGrid(filledWords[filledWords.length - 1]);
            if (this.placeWords(emptyWords, filledWords, difficulty)) {
                return true;
            }
        }
        const lastEntry: Word = filledWords.pop();
        if (lastEntry !== undefined) {
            lastEntry.value = "";
            emptyWords.push(lastEntry);
            this.updateGrid(lastEntry);
        }

        return false;
    }

    private createTemplate(word: Word): string {
        let template: string = "";
        for (let i: number = 0; i < word.size; i++) {
            if (word.direction === "horizontal") {
                template += this._grid[word.row][word.column + i];
            } else {
                template += this._grid[word.row + i][word.column];
            }
        }

        return template;
    }

    private updateGrid(word: Word): void {
        if (word.value.length === 0) {
            word.value = "";
            for (let i: number = 0; i < word.size; i++) {
                word.value += WHITE_CASE;
            }
        }
        for (let i: number = 0; i < word.size; i++) {
            if (word.direction === "horizontal") {
                this._grid[word.row][word.column + i] = word.value[i];
            } else {
                this._grid[word.row + i][word.column] = word.value[i];
            }
        }
    }

    private contains(word: string, words: Word[]): boolean {
        for (const w of words) {
            if (w.value === word) {
                return true;
            }
        }

        return false;
    }
*/
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

    private generateEmptyWords(lane: string[], index: number, direction: string): Word[] {
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

    private async getWords(wordSkeleton: String, difficulty: String): Promise<JSON> {
        const url: String = "http://localhost:3000/service/lexical/wordsearch/" + wordSkeleton + "/" + difficulty;
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            json: true, uri: url
          };
        try {
            return await requestPromise(options);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // tslint:disable-next-line:max-func-body-length
/*    private findWord(template: string): string[] {
        const results: string[] = [];
        switch (template) {
            case "--": {
                results.push("to");
                results.push("at");
                results.push("al");
                results.push("lo");
                break;
            }
            case "to": {
                results.push("to");
                break;
            }
            case "at": {
                results.push("at");
                break;
            }
            case "al": {
                results.push("al");
                break;
            }
            case "lo": {
                results.push("lo");
                break;
            }
            case "-t": {
                results.push("at");
                break;
            }
            case "-o": {
                results.push("to");
                results.push("lo");
                break;
            }
            case "-l": {
                results.push("al");
                break;
            }
            case "t-": {
                results.push("to");
                break;
            }
            case "a-": {
                results.push("al");
                results.push("at");
                break;
            }
            case "l-": {
                results.push("lo");
                break;
            }

            default: break;
        }

        return results;
    } 
    */
}
