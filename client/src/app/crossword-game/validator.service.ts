import { Injectable } from '@angular/core';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { WordService } from './word.service';
import { SocketService } from './socket.service';
import { UserGridService } from './user-grid.service';

@Injectable()
export class ValidatorService {
    private filledGrid: string[][];

    public isEndOfGame: boolean = false;

    public constructor(private wordService: WordService,
                       private socketService: SocketService,
                       private userGridService: UserGridService) {
    }

    // public method to be initialized only once the words are fetched from the server.
    public initialize(): void {
        this.initializeGrid();
        this.fillGrid();
    }

    public isValidatedWord(word: GridWord): boolean {
        return this.socketService.game.hostValidatedWords.includes(word) || this.socketService.game.guestValidatedwords.includes(word);
    }

    public isLocalValidatedDefinition(definition: string): boolean {
        return this.isValidatedDefinition(!this.socketService.isHost, definition);
    }

    public isRemoteValidatedDefinition(definition: string): boolean {
        return this.isValidatedDefinition(this.socketService.isHost, definition);
    }

    public isValidatedDefinition(isHost: boolean, definition: string): boolean {
        if (isHost) {
            return this.isHostValidatedDefinition(definition);
        } else {
            return this.isGuestValidatedDefinition(definition);
        }
    }

    public isHostValidatedDefinition(definition: string): boolean {
        for (const word of this.socketService.game.hostValidatedWords) {
            if (word.definition === definition) {
                return true;
            }
        }

        return false;
    }

    public isGuestValidatedDefinition(definition: string): boolean {
        for (const word of this.socketService.game.guestValidatedwords) {
            if (word.definition === definition) {
                return true;
            }
        }

        return false;
    }

    public updateValidatedWords(grid: string[][]): void {
        for (const word of this.wordService.words) {
            if (this.socketService.game.hostValidatedWords.includes(word)) {
                continue;
            } else if (this.socketService.game.guestValidatedwords.includes(word)) {
                continue;
            } else {

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
    }

    public setValidatedWords(local: GridWord[], remote: GridWord[]): void {
        this.socketService.game.hostValidatedWords = local;
        this.socketService.game.guestValidatedwords = remote;
    }

    private addValidatedWord(word: GridWord): void {
        if (!this.isValidatedWord(word)) {
            //this.selectionService.deselect();
            this.socketService.addValidatedWord(word);
        }
    }

    public isValidatedCell(row: number, column: number): boolean {
        return this.isLocalValidatedCell(row, column) || this.isRemoteValidatedCell(row, column);
    }

    public isBothValidatedCell(row: number, column: number): boolean {
        return this.isLocalValidatedCell(row, column) && this.isRemoteValidatedCell(row, column);
    }

    public isLocalValidatedCell(row: number, column: number): boolean {
        if (!this.socketService.isHost) {
            return this.isGuestValidatedCell(row, column);
        } else {
            return this.isHostValidatedCell(row, column);
        }
    }

    public isRemoteValidatedCell(row: number, column: number): boolean {
        let isRemoteValidatedCell: boolean = false;
        isRemoteValidatedCell = this.socketService.isHost ?
            this.isGuestValidatedCell(row, column) : this.isHostValidatedCell(row, column);
        if (isRemoteValidatedCell) {
            this.userGridService.userGrid[row][column] = this.expectedLetterInCell(row, column);
        }

        return isRemoteValidatedCell;
    }

    private isHostValidatedCell(row: number, column: number): boolean {
        for (const word of this.socketService.game.hostValidatedWords) {
            if (word.includesCell(row, column)) {
                return true;
            }
        }

        return false;
    }

    private isGuestValidatedCell(row: number, column: number): boolean {
        for (const word of this.socketService.game.guestValidatedwords) {
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
            if (!this.socketService.game.hostValidatedWords.includes(word) || !this.socketService.game.guestValidatedwords.includes(word)) {
                this.isEndOfGame = false;

                return;
            }
        }

        this.isEndOfGame = true;
    }

    private expectedLetterInCell (row: number, column: number): string {
        for (const word of this.wordService.words) {
            if (word.includesCell(row, column)) {
                if (word.direction === Direction.HORIZONTAL) {
                    return word.value[column - word.column];
                } else {
                    return word.value[row - word.row];
                }
            }
        }

        return "";
    }
}
