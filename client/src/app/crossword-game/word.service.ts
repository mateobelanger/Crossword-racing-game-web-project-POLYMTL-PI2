import { Injectable } from "@angular/core";
import { Word, Direction } from "../../../../common/word";
import { words } from "./mock-words";
import { GRID_SIZE } from '../../../../common/constants';

@Injectable()
export class WordService {
    public words: Word[];
    private _selectedWord: Word;

    public constructor() {
        this.words = words;
        this._selectedWord = null;
    }

    public get selectedWord(): Word {
        return this._selectedWord;
    }

    public get definition(): string {
        if (this._selectedWord === null) {
            return null;
        }

        return this._selectedWord.definition;
    }

    public set definition(definition: string) {
        for (const word of this.words) {
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

        for (const word of this.words) {
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
