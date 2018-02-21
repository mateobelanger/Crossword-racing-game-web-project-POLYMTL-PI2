import { Component, OnInit, AfterViewInit } from "@angular/core";
import { WordService } from "../word.service";
import { Word, Direction } from "../../../../../common/word";

const KEY_BACKSPACE: number = 8;
const KEY_DELETE: number = 46;
const KEY_A: number = 65;
const KEY_Z: number = 90;

const GRID_SIZE: number = 10;

const BLACK_CASE: string = '-';


@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit, AfterViewInit {

    private userGrid: string[][];

    public constructor(private wordService: WordService) {
        this.userGrid = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < GRID_SIZE; j++) {
                row.push(BLACK_CASE);
            }
            this.userGrid.push(row);
        }
    }

    public ngOnInit(): void {
        this.fillGrid();
    }

    public ngAfterViewInit(): void {
        const element: HTMLElement = document.getElementById('0');
        element.focus();
        this.wordService.selectWord(0, 0);
    }

    public isValidInput(keyCode: number, row: number, column: number): boolean {
        if (keyCode >= KEY_A && keyCode <= KEY_Z) {

            return true;
        } else if (keyCode === KEY_BACKSPACE || keyCode === KEY_DELETE) {
            this.backspace(row, column);

            return false;
        } else {
            return false;
        }
    }

    // TODO : avons-nous absolument besoin de passer par cette fonction?
    public trackByIndex(index: number): number {
        return index;
    }

    public calculateId(rowIndex: number, columnIndex: number): number {
        return rowIndex * GRID_SIZE + columnIndex;
    }

    public selectWord(rowIndex: number, columnIndex: number): void {
        this.wordService.selectWord(rowIndex, columnIndex);

        this.wordService.focusOnFirstEmptyCell(this.userGrid);
    }

    public isSelectedWord(id: number): boolean {
        const word: Word = this.wordService.selectedWord;
        if (word === null) {
            return false;
        }
        const row: number = Math.floor(id / GRID_SIZE);
        const col: number = id - row * GRID_SIZE;
        if (word.direction === Direction.Horizontal) {
            return row === word.row && col >= word.column && col < word.column + word.size;
        } else {
            return col === word.column && row >= word.row && row < word.row + word.size;
        }
    }

    public backspace(row: number, column: number): void {
        this.userGrid[row][column] = "";
        if (this.wordService.selectedWord.direction === Direction.Horizontal) {
            if (column !== this.wordService.selectedWord.column) {
                this.userGrid[row][column - 1] = "";
            }
        } else {
            if (row !== this.wordService.selectedWord.row) {
                this.userGrid[row - 1][column] = "";
            }
        }
        this.wordService.focusOnPreviousCell(row, column);
    }

    private fillGrid(): void {
        const words: Word[] = this.wordService.words;
        for (const word of words) {
            for (let i: number = 0; i < word.size; i++) {
                let row: number;
                let col: number;
                if (word.direction === Direction.Horizontal) {
                    row = word.row;
                    col = word.column + i;
                } else {
                    row = word.row + i;
                    col = word.column;
                }
                this.userGrid[row][col] = ""; // word.value[i];
            }
        }

    }

}
