import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { Word, Direction } from '../../../../common/word';
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
        this.initializeGrid();
    }

    public fillGrid(): void {
        const words: Word[] = this.wordService.words;
        for (const word of words) {
            for (let i: number = 0; i < word.size; i++) {
                let row: number;
                let col: number;
                if (word.direction === Direction.HORIZONTAL) {
                    row = word.row;
                    col = word.column + i;
                } else {
                    row = word.row + i;
                    col = word.column;
                }
                this.userGrid[row][col] = "";
                this.validatedCells[row][col] = false;
            }
        }
    }

    public keyDown(keyCode: number, row: number, column: number): boolean {
        if (keyCode >= KEY_A && keyCode <= KEY_Z) {

            return true;
        } else if (keyCode === KEY_BACKSPACE || keyCode === KEY_DELETE) {
            this.backspace(row, column);

            return false;
        } else {
            return false;
        }
    }

    public keyUp(keyCode: number, row: number, column: number): void {
        const word: Word = this.wordService.selectedWord;
        if (this.userGrid[row][column] !== "") {
            if (word.direction === Direction.HORIZONTAL) {
                if (word.column + word.value.length - 1 !== column) {
                    this.focusOnSelectedWord();
                }
            } else if (word.direction === Direction.VERTICAL) {
                if (word.row + word.value.length - 1 !== row) {
                    this.focusOnSelectedWord();
                }
            }
            if (this.validateWord()) {
                this.updateValidatedCells();
            }
        }
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
        const word: Word = this.wordService.selectedWord;
        if (word === null) {
            return false;
        }
        const row: number = Math.floor(id / GRID_SIZE);
        const col: number = id - row * GRID_SIZE;
        if (word.direction === Direction.HORIZONTAL) {
            return row === word.row && col >= word.column && col < word.column + word.size;
        } else {
            return col === word.column && row >= word.row && row < word.row + word.size;
        }
    }

    public focusOnSelectedWord(): void {
        this.focusOnCell(this.idOfFirstEmptyCell());
    }

    public validateWord(): boolean {
        let isValid: boolean = true;
        const rowIndex: number = this.wordService.selectedWord.row;
        const columnIndex: number = this.wordService.selectedWord.column;
        for (let i: number = 0; i < this.wordService.selectedWord.value.length && isValid; i++) {
            this.wordService.selectedWord.direction === Direction.HORIZONTAL ?
                isValid = (this.wordService.selectedWord.value[i] === this.userGrid[rowIndex][columnIndex + i]) :
                isValid = (this.wordService.selectedWord.value[i] === this.userGrid[rowIndex + i][columnIndex]);
        }

        return isValid;
    }

    public generateId (rowIndex: number, columnIndex: number): number {
        return rowIndex * GRID_SIZE + columnIndex;
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
        let rowIndex: number = this.wordService.selectedWord.row;
        let columnIndex: number = this.wordService.selectedWord.column;

        let selectedRow: number = this.wordService.selectedWord.row;
        let selectedColumn: number = this.wordService.selectedWord.column;

        while (this.userGrid[rowIndex][columnIndex] !== "") {
            if (this.wordService.selectedWord.direction === Direction.HORIZONTAL) {
                if (selectedRow === 0) {
                    selectedRow++;
                }
                if (++columnIndex === (selectedRow - 1 + this.wordService.selectedWord.value.length - 1)) {
                    break;
                }
            } else {
                if (selectedColumn === 0) {
                    selectedColumn++;
                }
                if (++rowIndex === (selectedColumn - 1 + this.wordService.selectedWord.value.length - 1)) {
                    break;
                }
            }
        }

        return this.generateId(rowIndex, columnIndex);
    }

    private updateValidatedCells(): void {
        const word: Word = this.wordService.selectedWord;
        for (let i: number = 0; i < word.value.length; i++) {
            if (word.direction === Direction.HORIZONTAL) {
                this.validatedCells[word.row][word.column + i] = true;
            } else {
                this.validatedCells[word.row + i][word.column] = true;
            }
        }
        this.wordService.deselect();
    }

    private positionOfLastUnvalidatedCell(row: number, column: number): number[] {
        let rowIndex: number = row;
        let columnIndex: number = column;

        do {
            if (this.wordService.selectedWord.direction === Direction.HORIZONTAL) {
                if (--columnIndex < this.wordService.selectedWord.column) {
                    columnIndex = column;
                    break;
                }
            } else {
                if (--rowIndex < this.wordService.selectedWord.row) {
                    rowIndex = row;
                    break;
                }
            }
        } while (this.validatedCells[rowIndex][columnIndex]);

        return [rowIndex, columnIndex];
    }

}
