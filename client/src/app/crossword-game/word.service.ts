import { Injectable } from "@angular/core";
import { Word, Direction } from "../../../../common/word";
import { words } from "./mock-words";
// following line causes circular dependencies:
// import { GRID_SIZE } from "./grid/grid.component";
const GRID_SIZE: number = 10;

@Injectable()
export class WordService {
    private _words: Word[];
    private _selectedWord: Word;

    public constructor() {
        this._words = words;
        this._selectedWord = null;
    }

    public get selectedWord(): Word {
        return this._selectedWord;
    }

    public get words(): Word[] {
        return this._words;
    }

    public get definition(): string {
        if (this._selectedWord === null) {
            return null;
        }

        return this._selectedWord.definition;
    }

    public set definition(definition: string) {
        for (const word of this._words) {
            if (word.definition === definition) {
                this._selectedWord = word;

                // this.focusOnFirstEmptyCell();

                return;
            }
        }
    }

    public selectWord(row: number, column: number): void {
        for (const word of words) {
            if (word === this._selectedWord) {
                continue;
            }
            if (word.direction === Direction.Horizontal) {
                if (word.row === row && column >= word.column && column < word.column + word.size) {
                    this._selectedWord = word;
                    break;
                }
            } else if (column === word.column && row >= word.row && row < word.row + word.size) {
                this._selectedWord = word;
                break;
            }
        }
    }

    public getDefinitions(direction: Direction): string[][] {
        const definitions: string[][] = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            definitions.push([]);
        }

        for (const word of this._words) {
            if (word.direction !== direction) {
                continue;
            }
            if (word.direction === Direction.Horizontal) {
                definitions[word.row].push(word.definition);
            } else {
                definitions[word.column].push(word.definition);
            }
        }

        return definitions;
    }

    public deselect(): void {
        this._selectedWord = null;
    }

    public focusOnFirstEmptyCell(userGrid: Array<Array<string>>): void {
        let rowIndex: number = this._selectedWord.row;
        let columnIndex: number = this._selectedWord.column;
        while (userGrid[rowIndex][columnIndex] !== "") {
            if (this._selectedWord.direction === Direction.Horizontal) {
                if (++columnIndex === (this._selectedWord.row + this._selectedWord.value.length - 1)) {
                    break;
                }
            } else {
                if (++rowIndex === (this._selectedWord.column + this._selectedWord.value.length - 1)) {
                    break;
                }
            }
        }
        const id: number = (rowIndex * 10) + columnIndex;
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
    }
}
