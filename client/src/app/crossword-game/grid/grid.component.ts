import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service'
import { Word, Direction } from '../../../../../common/word'

const UPPERCASE_A: number = 65;
const UPPERCASE_Z: number = 90;
const LOWERCASE_A: number = 97;
const LOWERCASE_Z: number = 122;
const BLACK_CASE: string = '-';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

    private userGrid: string[][];

    public constructor(private wordService: WordService) {
        this.userGrid = [];
        for (let i: number = 0; i < 10; i++) {
            const row: string[] = []
            for (let j: number = 0; j < 10; j++) {
                row.push(BLACK_CASE);
            }
            this.userGrid.push(row);
        }
    }

    public ngOnInit(): void {
        this.fillGrid();
    }

    public isLetter(keyCode: number): boolean {
        return (keyCode >= UPPERCASE_A && keyCode <= UPPERCASE_Z ||
                keyCode >= LOWERCASE_A && keyCode <= LOWERCASE_Z );
    }

    public trackByIndex(index: number): number {
        return index;
    }

    public calculateId(rowIndex: number, columnIndex: number): number {
        return rowIndex * 10 + columnIndex;
    }

    public selectWord(rowIndex: number, columnIndex: number) {
        this.wordService.selectWord(rowIndex, columnIndex);
    }

    public isSelectedWord(id: number): boolean {
        const word: Word = this.wordService.selectedWord;
        if (word === null) {
            return false;
        }
        const row: number = Math.floor(id / 10);
        const col: number = id - row * 10;
        if (word.direction === Direction.Horizontal) {
            return row === word.row && col >= word.column && col < word.column + word.size;
        } else {
            return col === word.column && row >= word.row && row < word.row + word.size;
        }
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
                this.userGrid[row][col] = word.value[i];
            }
        }

    }

}
