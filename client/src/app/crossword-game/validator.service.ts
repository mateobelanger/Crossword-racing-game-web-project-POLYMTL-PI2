import { Injectable } from '@angular/core';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { WordService } from './word.service';
import { SocketService } from './socket.service';

@Injectable()
export class ValidatorService {
    private localValidatedWords: GridWord[];
    private remoteValidatedWords: GridWord[];
    private filledGrid: string[][];

    public isEndOfGame: boolean = false;

    public constructor(private wordService: WordService, private socketService: SocketService) {
    }

    // public method to be initialized only once the words are fetched from the server.
    public initialize(): void {
        this.localValidatedWords = [];
        this.remoteValidatedWords = [];
        this.initializeGrid();
        this.fillGrid();
    }

    public isValidatedWord(word: GridWord): boolean {
        return this.localValidatedWords.includes(word) || this.remoteValidatedWords.includes(word);
    }

    public isValidatedDefinition(definition: string): boolean {
        for (const word of this.localValidatedWords) {
            if (word.definition === definition) {
                return true;
            }
        }
        for (const word of this.remoteValidatedWords) {
            if (word.definition === definition) {
                return true;
            }
        }

        return false;
    }

    public updateValidatedWords(grid: string[][]): void {
        for (const word of this.wordService.words) {
            if (this.localValidatedWords.includes(word)) {
                continue;
            } else if (this.remoteValidatedWords.includes(word)) {
                continue;
            }

            let row: number = word.row;
            let column: number = word.column;
            let isValidated: boolean = true;
            for (let i: number = 0; i < word.value.length; i++) {
                word.direction === Direction.HORIZONTAL ?
                    column = word.column + i : row = word.row + i;

                if (grid[row][column].toLowerCase() !== this.filledGrid[row][column]) {
                    isValidated = false;
                    break;
                }
            }
            if (isValidated) {
                this.addValidatedWord(word);
                this.updateEndOfGame();
            }
        }
    }

    public setValidatedWords(local: GridWord[], remote: GridWord[]): void {
        this.localValidatedWords = local;
        this.remoteValidatedWords = remote;
    }

    private addValidatedWord(word: GridWord): void {
        if (!this.localValidatedWords.includes(word) && !this.remoteValidatedWords.includes(word)) {
            this.localValidatedWords.push(word);
            this.socketService.addValidatedWord(word);
        }
    }

    public isValidatedCell(row: number, column: number): boolean {
        return this.isLocalValidatedCell(row, column) || this.isRemoteValidatedCell(row, column);
    }

    public isLocalValidatedCell(row: number, column: number): boolean {
        for (const word of this.localValidatedWords) {
            if (word.includesCell(row, column)) {
                return true;
            }
        }

        return false;
    }

    public isRemoteValidatedCell(row: number, column: number): boolean {
       for (const word of this.remoteValidatedWords) {
           if (word.includesCell(row, column)) {
               return true;
           }
       }

       return false;
   }

    private initializeGrid(): void {
        this.filledGrid = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < GRID_SIZE; j++) {
                row.push("");
            }
            this.filledGrid.push(row);
        }
    }

    private fillGrid(): void {
        for (const word of this.wordService.words) {
            let row: number = word.row;
            let column: number = word.column;
            for (const char of word.value) {
                this.filledGrid[row][column] = char;

                word.direction === Direction.HORIZONTAL ?
                    column += 1 : row += 1;
            }
        }
    }

    private updateEndOfGame(): void {
        for (const word of this.wordService.words) {
            if (!this.localValidatedWords.includes(word) || !this.remoteValidatedWords.includes(word)) {
                this.isEndOfGame = false;

                return;
            }
        }

        this.isEndOfGame = true;
    }
}
