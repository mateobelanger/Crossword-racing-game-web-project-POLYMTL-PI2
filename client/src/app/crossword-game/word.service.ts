import { Injectable } from '@angular/core';
import { Word, Direction } from '../../../../common/word';
import { words } from './mock-words';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WordService {
    private _words: Word[];
    private _selectedWord: Word;
    public _selectedWordChange: Subject<Word> = new Subject<Word>();

    public constructor() {
        this._words = words;
        this._selectedWord = null;

        this._selectedWordChange.subscribe((word: Word) => {
            this._selectedWord = word;
        })
    }

    public get selectedWord() {
        return this._selectedWord;
    }

    public get words() {
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
                this._selectedWordChange.next(word);
                return;
            }
        }
    }
    
    public selectWord(row: number, column: number): void {
        for (const word of words) {
            if (word.direction === Direction.Horizontal){
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
        for (let i: number = 0; i < 10; i++) {
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
        this._selectedWord = null
    }

}
