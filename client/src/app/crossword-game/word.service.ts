import { Injectable } from '@angular/core';
import { Word } from '../../../../common/word';

@Injectable()
export class WordService {
    private _words: Word[];
    private _selectedWord: Word;

    public constructor() {
        this.deselect();
    }

    public set selectedWord(word: Word) {
        this._selectedWord = word;
    }

    public getDefinition(): Word {
        return this._selectedWord;
    }

    public deselect(): void {
        this._selectedWord = undefined;
    }

}
