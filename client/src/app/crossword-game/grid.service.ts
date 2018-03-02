import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';

const KEY_BACKSPACE: number = 8;
const KEY_DELETE: number = 46;
const KEY_A: number = 65;
const KEY_Z: number = 90;

const BLACK_CELL: string = '-';

@Injectable()
export class GridService {
    public userGrid: string[][];
    public validatedCells: boolean[][];

    public constructor(private wordService: WordService) {
        this.userGrid = [];
        this.validatedCells = [];
        this.initialize();
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

    public backspace(row: number, column: number): void {
        if (this.userGrid[row][column] === "") {
            const positionToEmpty: number[] = this.positionOfLastUnvalidatedCell(row, column);
            this.userGrid[positionToEmpty[0]][positionToEmpty[1]] = "";
            this.focusOnSelectedWord();
        } else {
            this.userGrid[row][column] = "";
        }
    }

    public selectWord(rowIndex: number, columnIndex: number): void {
        this.wordService.selectWord(rowIndex, columnIndex);

        this.focusOnSelectedWord();
    }

    public isSelectedWord(id: number): boolean {
        const word: GridWord = this.wordService.selectedWord;
        if (word === null) {
            return false;
        }
        if (this.isValidatedWord(word)) {
            return false;
        }
        const row: number = Math.floor(id / GRID_SIZE);
        const col: number = id - row * GRID_SIZE;
        if (word.direction === Direction.HORIZONTAL) {
            return row === word.row && col >= word.column && col < word.column + word.value.length;
        } else {
            return  col === word.column && row >= word.row && row < word.row + word.value.length;
        }
    }

    public focusOnSelectedWord(): void {
        this.focusOnCell(this.idOfFirstEmptyCell());
    }

    public isValidatedWord(selectedWord: GridWord): boolean {
        let isValid: boolean = true;
        const rowIndex: number = selectedWord.row;
        const columnIndex: number = selectedWord.column;

        for (let i: number = 0; i < selectedWord.value.length && isValid; i++) {
            selectedWord.direction === Direction.HORIZONTAL ?
                isValid = (selectedWord.value[i] === this.userGrid[rowIndex][columnIndex + i].toLowerCase()) :
                isValid = (selectedWord.value[i] === this.userGrid[rowIndex + i][columnIndex].toLowerCase());
        }

        return isValid;
    }

    public updateValidatedCells(word: GridWord): void {
        for (let i: number = 0; i < word.value.length; i++) {
            if (word.direction === Direction.HORIZONTAL) {
                this.validatedCells[word.row][word.column + i] = true;
            } else {
                this.validatedCells[word.row + i][word.column] = true;
            }
        }
    }

    public generateId (rowIndex: number, columnIndex: number): number {
        return rowIndex * GRID_SIZE + columnIndex;
    }

    public fillGrid(): void {
        const words: GridWord[] = this.wordService.words;
        for (const word of words) {
            let row: number = word.row;
            let col: number = word.column;
            for (let i: number = 0; i < word.value.length; i++) {
                word.direction === Direction.HORIZONTAL ?
                    col = word.column + i : row = word.row + i;

                this.userGrid[row][col] = "";
                this.validatedCells[row][col] = false;
            }
        }
    }

    private initializeGrid(): void {
        for (let i: number = 0; i < GRID_SIZE; i++) {
            const row: string[] = [];
            const rowValidated: boolean[] = [];
            for (let j: number = 0; j < GRID_SIZE; j++) {
                row.push(BLACK_CELL);
                rowValidated.push(true);
            }
            this.userGrid.push(row);
            this.validatedCells.push(rowValidated);
        }
    }

    private focusOnCell(id: number): void {
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
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
        } while (this.validatedCells[row][column]);

        return [row, column];
    }

}
