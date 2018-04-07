import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { ValidatorService } from './validator.service';

const KEY_BACKSPACE: number = 8;
const KEY_DELETE: number = 46;
const KEY_A: number = 65;
const KEY_Z: number = 90;

const BLACK_CELL: string = '-';

@Injectable()
export class GridService {
    public userGrid: string[][];

    public constructor(private wordService: WordService, private validatorService: ValidatorService) {
        this.userGrid = [];
    }

    public initialize(): void {
        this.initializeGrid();
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
        if (this.wordService.selectedWord.direction === Direction.HORIZONTAL &&
            this.wordService.selectedWord.column + this.wordService.selectedWord.value.length - 1 !== column) {
            this.focusOnSelectedWord();

        } else if (this.wordService.selectedWord.row + this.wordService.selectedWord.value.length - 1 !== row) {
            this.focusOnSelectedWord();
        }

        this.validatorService.updateValidatedWords(this.userGrid);
    }

    public selectWord(row: number, column: number): void {
        this.wordService.selectWord(row, column);
        this.focusOnSelectedWord();
    }

    public isSelectedWord(row: number, column: number): boolean {
        const word: GridWord = this.wordService.selectedWord;
        if (word === null || this.validatorService.isValidatedWord(word)) {
            return false;
        }

        return word.includesCell(row, column);
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

                this.userGrid[row][col] = "";
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

    public isLocalValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isLocalValidatedCell(row, column);
    }

    public isRemnoteValidatedCell(row: number, column: number): boolean {
        return this.validatorService.isRemoteValidatedCell(row, column);
    }

    private backspace(row: number, column: number): void {
        if (this.userGrid[row][column] === "") {
            const positionToEmpty: number[] = this.positionOfLastUnvalidatedCell(row, column);
            this.userGrid[positionToEmpty[0]][positionToEmpty[1]] = "";
            this.focusOnSelectedWord();
        } else {
            this.userGrid[row][column] = "";
        }
    }

    private initializeGrid(): void {
        this.userGrid = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < GRID_SIZE; j++) {
                row.push(BLACK_CELL);
            }
            this.userGrid.push(row);
        }
    }

    private focusOnCell(id: number): void {
        const input: HTMLElement = document.getElementById(id.toString());
        if (input) {
            input.focus();
        }
    }

    private idOfFirstEmptyCell(): number {
        let row: number = this.wordService.selectedWord.row;
        let column: number = this.wordService.selectedWord.column;

        for (let i: number = 0; i < this.wordService.selectedWord.value.length; i++) {
            this.wordService.selectedWord.direction === Direction.HORIZONTAL ?
                column = this.wordService.selectedWord.column + i :
                row = this.wordService.selectedWord.row + i;

            if (this.userGrid[row][column] === "") {
                break;
            }
        }

        return this.generateId(row, column);
    }

    private positionOfLastUnvalidatedCell(row: number, column: number): number[] {
        const oldRow: number = row;
        const oldCol: number = column;

        do {
            this.wordService.selectedWord.direction === Direction.HORIZONTAL ?
                column-- : row--;
            if (row < this.wordService.selectedWord.row || column < this.wordService.selectedWord.column) {
                    row = oldRow;
                    column = oldCol;
                    break;
                }
        } while (this.validatorService.isValidatedCell(row, column));

        return [row, column];
    }

}
