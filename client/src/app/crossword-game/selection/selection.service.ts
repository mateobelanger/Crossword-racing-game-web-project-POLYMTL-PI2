import { Injectable } from '@angular/core';
import { GridWord } from '../../../../../common/crosswordsInterfaces/word';
import { WordService } from '../word.service';
import { SocketService } from '../socket.service';

@Injectable()
export class SelectionService {

    private _selectedWord: GridWord;

    public constructor(private wordService: WordService, private socketService: SocketService) {
        this._selectedWord = null;

    }


    public get selectedWord(): GridWord {
        return this._selectedWord;
    }

    public get remoteSelectedWord(): GridWord {
        return this.socketService.remoteSelectedWord;
    }


    public get definition(): string {
        if (this._selectedWord === null) {
            return null;
        }

        return this._selectedWord.definition;
    }

    public set definition(definition: string) {
        for (const word of this.wordService.words) {
            if (word.definition === definition) {
                this._selectedWord = word;
                this.socketService.selectWord(this._selectedWord);
                break;
            }
        }
    }

    public selectWord(row: number, column: number): void {
        for (const word of this.wordService.words) {
            if (word === this._selectedWord) {
                continue;
            }
            if (word.includesCell(row, column)) {
                this._selectedWord = word;
                this.socketService.selectWord(this._selectedWord);
                break;
            }
        }
    }


    public deselect(): void {
        this._selectedWord = null;
        this.socketService.selectWord(this._selectedWord);
    }
}
