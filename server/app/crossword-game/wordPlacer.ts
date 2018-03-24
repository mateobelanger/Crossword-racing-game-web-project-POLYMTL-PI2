import { Direction, GridWord } from "../../../common/crosswordsInterfaces/word";
import { GridEntry } from "./GridEntry";
import { WordSelector } from "../lexicalService/wordSelector";
import { WHITE_CELL, BLACK_CELL, DEFAULT_GRID_SIZE } from "./gridCreator";

export class WordPlacer {
    private _emptyWords: GridEntry[];
    private _placedWords: GridEntry[];
    private _grid: string[][];

    public constructor(words: GridWord[], grid: string[][]) {
        this._emptyWords = [];
        this._placedWords = [];
        this.initializeGrid(grid);

        for (const word of words) {
            this._emptyWords.push(new GridEntry(word));
        }
        this.sortByLength();
    }

    public get grid(): string[][] {
        return this._grid;
    }

    public get words(): GridWord[] {
        return this._placedWords;
    }

    public async placeWords(difficulty: string): Promise<boolean> {
        if (this._emptyWords.length === 0) {
            return true;
        }

        const current: GridEntry = this._emptyWords.pop();
        const template: string = this.createTemplate(current);
        const results: string[] = WordSelector.getWords(template);
        for (const result of results) {
            if (this.isAlreadyUsed(result)) {
                continue;
            }
            current.value = result;
            current.definition = result; // TODO : TEST BEFORE ADDING DEFINITIONS WITH DATAMUSE
            this._placedWords.push(current);

            this.update();
            if (await this.placeWords(difficulty)) {
                return true;
            }
        }
        // no new word has been placed => backtrack
        this._placedWords.pop();
        this._emptyWords.push(current);
        this.update();

        return false;
    }

    private initializeGrid(grid: string[][]): void {
        this._grid = [];
        // deep copy of the passed array.
        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < DEFAULT_GRID_SIZE; j++) {
                row.push(grid[i][j]);
            }
            this._grid.push(row);
        }
    }

    private createTemplate(entry: GridEntry): string {
        let template: string = "";
        let row: number = entry.row;
        let column: number = entry.column;
        for (let i: number = 0; i < entry.size; i++) {
            entry.direction === Direction.HORIZONTAL? 
                column = entry.column + i : row = entry.row + i;
            
            template += this._grid[row][column];
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
        for (let i: number = 0; i < DEFAULT_GRID_SIZE; i++) {
            for (let j: number = 0; j < DEFAULT_GRID_SIZE; j++) {
                if (this._grid[i][j] !== BLACK_CELL) {
                    this._grid[i][j] = WHITE_CELL;
                }
            }
        }
        for (const entry of this._placedWords) {
            for (let i: number = 0; i < entry.size; i++) {
                if (entry.direction === Direction.HORIZONTAL) {
                    this._grid[entry.row][entry.column + i] = entry.value[i];
                } else {
                    this._grid[entry.row + i][entry.column] = entry.value[i];
                }
            }
        }
    }

    private updateWeights(): void {
        this.resetWeights();
        for (const word of this._placedWords) {
            for (const entry of this._emptyWords) {
                if (entry.crosses(word)) {
                    entry.weight++;
                }
            }
        }
        for (const entry of this._emptyWords) {
            entry.weight /= entry.size;
        }
    }

    private resetWeights(): void {
        for (const entry of this._emptyWords) {
            entry.weight = 0;
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
            return entry1.size - entry2.size;
        });
    }

    private isAlreadyUsed(word: string): boolean {
        for (const w of this._placedWords) {
            if (w.value === word) {
                return true;
            }
        }

        return false;
    }
}
