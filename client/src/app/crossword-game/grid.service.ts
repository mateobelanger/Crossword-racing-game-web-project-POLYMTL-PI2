import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { ValidatorService } from './validator.service';
import { SelectionService } from './selection/selection.service';
import { UserGridService } from './user-grid.service';

const KEY_BACKSPACE: number = 8;
const KEY_DELETE: number = 46;
const KEY_A: number = 65;
const KEY_Z: number = 90;

@Injectable()
export class GridService {

    public constructor(private selectionService: SelectionService,
                       private wordService: WordService,
                       private validatorService: ValidatorService,
                       private userGridService: UserGridService) {
    }

    public initialize(): void {
        this.userGridService.initialize();
        this.fillGrid();
    }

    public keyDown(keyCode: number, row: number, column: number): boolean {
        if (keyCode >= KEY_A && keyCode <= KEY_Z) {
            return true;
        } else if (keyCode === KEY_BACKSPACE || keyCode === KEY_DELETE) {
            this.backspace(row, column);
        }

        return false;
    }

    public keyUp(row: number, column: number): void {
        if (this.selectionService.selectedWord.direction === Direction.HORIZONTAL &&
            this.selectionService.selectedWord.column + this.selectionService.selectedWord.value.length - 1 !== column) {
            this.focusOnSelectedWord();

        } else if (this.selectionService.selectedWord.row + this.selectionService.selectedWord.value.length - 1 !== row) {
            this.focusOnSelectedWord();
        }

        this.validatorService.updateValidatedWords(this.userGridService.userGrid);
    }

    public selectWord(row: number, column: number): void {
        this.selectionService.selectWord(row, column);
        this.focusOnSelectedWord();
    }



    public isSelectedWord(row: number, column: number): boolean {
        const word: GridWord = this.selectionService.selectedWord;
        if (word === null || this.validatorService.isValidatedWord(word)) {
            return false;
        }

        return word.includesCell(row, column);
    }

    public isRemoteSelectedWord(row: number, column: number): boolean {
        const word: GridWord = this.selectionService.remoteSelectedWord;
        if (word === null || this.validatorService.isValidatedWord(word)) {
            return false;
        }

        return word.includesCell(row, column);
    }

    public isBothSelectedWord(row: number, column: number): boolean {
        return this.isRemoteSelectedWord(row, column) && this.isSelectedWord(row, column);
    }

    public focusOnSelectedWord(): void {
        this.focusOnCell(this.idOfFirstEmptyCell());
    }

    public generateId (row: number, column: number): number {
        return row * GRID_SIZE + column;
    }

    public fillGrid(): void {
        for (const word of this.wordService.words) {
            let row: number = word.row;
            let col: number = word.column;
            for (let i: number = 0; i < word.value.length; i++) {
                word.direction === Direction.HORIZONTAL ?
                    col = word.column + i : row = word.row + i;

                this.userGridService.userGrid[row][col] = "";
            }
        }
    }

    public isEndOfGame(): boolean {
        return this.validatorService.isEndOfGame;
    }

    public setEndOfGame(state: boolean): void {
        this.validatorService.isEndOfGame = state;
    }

    public isValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isValidatedCell(row, column);
    }

    public isBothValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isBothValidatedCell(row, column);
    }

    public isLocalValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isLocalValidatedCell(row, column);
    }

    public isRemoteValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isRemoteValidatedCell(row, column);
    }

    private backspace(row: number, column: number): void {
        if (this.userGridService.userGrid[row][column] === "") {
            const positionToEmpty: number[] = this.positionOfLastUnvalidatedCell(row, column);
            this.userGridService.userGrid[positionToEmpty[0]][positionToEmpty[1]] = "";
            this.focusOnSelectedWord();
        } else {
            this.userGridService.userGrid[row][column] = "";
        }
    }

    private focusOnCell(id: number): void {
        const input: HTMLElement = document.getElementById(id.toString());
        if (input) {
            input.focus();
        }
    }

    private idOfFirstEmptyCell(): number {
        let row: number = this.selectionService.selectedWord.row;
        let column: number = this.selectionService.selectedWord.column;

        for (let i: number = 0; i < this.selectionService.selectedWord.value.length; i++) {
            this.selectionService.selectedWord.direction === Direction.HORIZONTAL ?
                column = this.selectionService.selectedWord.column + i :
                row = this.selectionService.selectedWord.row + i;

            if (this.userGridService.userGrid[row][column] === "") {
                break;
            }
        }

        return this.generateId(row, column);
    }

    private positionOfLastUnvalidatedCell(row: number, column: number): number[] {
        const oldRow: number = row;
        const oldCol: number = column;

        do {
            this.selectionService.selectedWord.direction === Direction.HORIZONTAL ?
                column-- : row--;
            if (row < this.selectionService.selectedWord.row || column < this.selectionService.selectedWord.column) {
                    row = oldRow;
                    column = oldCol;
                    break;
                }
        } while (this.validatorService.isValidatedCell(row, column));

        return [row, column];
    }

}
