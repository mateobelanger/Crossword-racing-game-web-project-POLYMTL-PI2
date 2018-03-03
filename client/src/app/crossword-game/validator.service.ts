import { Injectable } from '@angular/core';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GRID_SIZE } from '../../../../common/constants';
import { WordService } from './word.service';

@Injectable()
export class ValidatorService {
    private validatedWords: GridWord[];
    private filledGrid: string[][];

    public constructor(private wordService: WordService) {
        this.validatedWords = [];
        this.initializeGrid();
        this.fillGrid();
    }

    public isValidatedWord(word: GridWord): boolean {
        return this.validatedWords.includes(word);
    }

    public isValidatedDefinition(definition: string): boolean {
        for (const word of this.validatedWords) {
            if (word.definition === definition) {
                return true;
            }
        }

        return false;
    }

    public isValidatedCell(row: number, column: number): boolean {
        for (const word of this.validatedWords) {
            if (word.includesCell(row, column)) {
                return true;
            }
        }

        return false;
    }

    public updateValidatedWords(grid: string[][]): void {
        for (const word of this.wordService.words) {
            let row: number = word.row;
            let column: number = word.column;
            let isValidated: boolean = true;
            for (let i: number = 0; i < word.value.length; i++) {
                word.direction === Direction.HORIZONTAL ?
                    column = word.column + i : row = word.row + i;

                if (grid[row][column] !== this.filledGrid[row][column]) {
                    isValidated = false;
                    break;
                }
            }
            if (isValidated) {
                this.addValidatedWord(word);
            }
        }
    }

    private addValidatedWord(word: GridWord): void {
        if (!this.validatedWords.includes(word)) {
            this.validatedWords.push(word);
        }
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
}
