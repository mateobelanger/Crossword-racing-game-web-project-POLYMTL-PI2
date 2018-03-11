import { Response } from "express";
import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";
import { GridEntry } from "./GridEntry";
import { WordSelector } from "../lexicalService/wordSelector";
import { WHITE_CELL, BLACK_CELL } from "./gridCreator";

export class WordPlacer {
    private _emptyWords: GridEntry[];
    private _placedWords: GridEntry[];
    private _grid: string[][];

    public constructor(words: GridWord[], grid: string[][]) {
        this._emptyWords = [];
        this._placedWords = [];
        for (const word of words) {
            this._emptyWords.push(new GridEntry(word));
        }
        this.sortByLength();
        this._grid = grid;
    }

    public async placeWords(difficulty: string, res: Response): Promise<boolean> {
        if (this._emptyWords.length === 0) {
            res.send(this._placedWords);

            return true;
        }
        
        const current: GridEntry = this._emptyWords.pop();
        const template: string = this.createTemplate(current);

        const results: Array<string> = WordSelector.getWords(template);
        for (let i: number = 0; i < results.length; i++) {
            if (this.isAlreadyUsed(results[i])) {
                continue;
            }
            current.word.value = results[i];
            this._placedWords.push(current);
            this.update();

            if (await this.placeWords(difficulty, res)) {
                return true;
            } 
        }
        // no new word has been placed => backtrack
        this._placedWords.pop();
        this._emptyWords.push(current);
        this.update();

        return false;
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

    private update(): void {
        this.updateGrid();
        this.updateWeights();
        this.sortByWeight();
    }

    // updates the letters in the 2D representation of the grid from the placed words.
    private updateGrid(): void {
        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid.length; j++) {
                if (this._grid[i][j] !== BLACK_CELL) {
                    this._grid[i][j] = WHITE_CELL;
                }
            }
        }
        for (const entry of this._placedWords) {
            for (let i: number = 0; i < entry.word.value.length; i++) {
                if (entry.word.direction === Direction.HORIZONTAL) {
                    this._grid[entry.word.row][entry.word.column + i] = entry.word.value[i];
                } else {
                    this._grid[entry.word.row + i][entry.word.column] = entry.word.value[i];
                }
            }
        }
    }

    private updateWeights(): void {
        for (const entry of this._emptyWords) {
            entry.weight = 0;
        }
        for (const word of this._placedWords) {
            for (const entry of this._emptyWords) {
                if (entry.crosses(word)) {
                    entry.weight++;
                }
            }
        }
    }

    // moves the more constrained words at the end of the array to be picked next.
    private sortByWeight(): void {
        this._emptyWords.sort((entry1: GridEntry, entry2: GridEntry) => {
            return entry1.weight - entry2.weight;
        });
    }

    private sortByLength(): void {
        this._emptyWords.sort((entry1: GridEntry, entry2: GridEntry) => {
            return entry1.word.value.length - entry2.word.value.length;
        })
    }

    private isAlreadyUsed(word: string): boolean {
        for (const w of this._placedWords) {
            if (w.word.value === word) {
                return true;
            }
        }

        return false;
    }
}
