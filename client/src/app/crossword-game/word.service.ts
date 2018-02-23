import { Injectable } from "@angular/core";
import { Word, Direction } from "../../../../common/word";
import { words } from "./mock-words";
// TODO : following line causes circular dependencies:
// import { GRID_SIZE } from "./grid/grid.component";
const GRID_SIZE: number = 10;

@Injectable()
export class WordService {
    private _words: Word[];
    private _selectedWord: Word;

    // TODO : we should probably put this._words = words;
    // in an other function like initialize because
    // when we are gonna have the gridgenerator we wont have
    // the words right away
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

                return;
            }
        }
    }

    public selectWord(row: number, column: number): void {
        for (const word of words) {
            if (word === this._selectedWord) {
                continue;
            }
            if (word.direction === Direction.HORIZONTAL) {
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
            if (word.direction === Direction.HORIZONTAL) {
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

}
