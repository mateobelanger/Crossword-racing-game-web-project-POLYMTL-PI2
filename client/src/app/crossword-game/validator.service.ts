import { Injectable } from '@angular/core';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { WordService } from './word.service';
import { SocketService } from './socket.service';
import { UserGridService } from './user-grid.service';
import { SelectionService } from './selection/selection.service';

@Injectable()
export class ValidatorService {
    private filledGrid: string[][];

    public isEndOfGame: boolean = false;

    public constructor(private wordService: WordService,
                       private socketService: SocketService,
                       private userGridService: UserGridService,
                       private selectionService: SelectionService) {
    }

    // public method to be initialized only once the words are fetched from the server.
    public initialize(): void {
        this.initializeGrid();
        this.fillGrid();
    }

    public isValidatedWord(word: GridWord): boolean {
        return this.socketService.game.hostValidatedWords.includes(word) || this.socketService.game.guestValidatedWords.includes(word);
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
        for (const word of this.socketService.game.guestValidatedWords) {
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
            } else if (this.socketService.game.guestValidatedWords.includes(word)) {
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
                if (isValidated && this.selectionService.selectedWord === word) {
                    this.selectionService.deselect();
                }
                if (isValidated) {
                    this.addValidatedWord(word);
                    // TODO: this.updateEndOfGame();
                }
            }
        }
    }

    public setValidatedWords(local: GridWord[], remote: GridWord[]): void {
        this.socketService.game.hostValidatedWords = local;
        this.socketService.game.guestValidatedWords = remote;
    }

    private addValidatedWord(word: GridWord): void {
        if (!this.isValidatedWord(word)) {
            this.socketService.addValidatedWord(word);
        }
    }

    public isValidatedCell(row: number, column: number): boolean {
        this.updateLocalGrid(row, column);

        return this.isHostValidatedCell(row, column) || this.isGuestValidatedCell(row, column);
    }

    public isBothValidatedCell(row: number, column: number): boolean {
        return this.isHostValidatedCell(row, column) && this.isGuestValidatedCell(row, column);
    }

    public updateLocalGrid(row: number, column: number): void {
        const isRemoteValidatedCell: boolean = this.socketService.isHost ?
            this.isGuestValidatedCell(row, column) : this.isHostValidatedCell(row, column);
        if (isRemoteValidatedCell) {
            this.userGridService.userGrid[row][column] = this.expectedLetterInCell(row, column);
        }
    }

    public isHostValidatedCell(row: number, column: number): boolean {
        for (const word of this.socketService.game.hostValidatedWords) {
            if (word.includesCell(row, column)) {
                return true;
            }
        }

        return false;
    }

    public isGuestValidatedCell(row: number, column: number): boolean {
        for (const word of this.socketService.game.guestValidatedWords) {
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

    /* TODO : 
    private updateEndOfGame(): void {
        for (const word of this.wordService.words) {
            if (!this.socketService.game.hostValidatedWords.includes(word) || !this.socketService.game.guestValidatedWords.includes(word)) {
                this.isEndOfGame = false;

                return;
            }
        }

        this.isEndOfGame = true;
    }
*/
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
