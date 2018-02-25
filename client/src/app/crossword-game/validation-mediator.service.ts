import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { DefinitionsService } from './definitions.service';
import { WordService } from './word.service';
import { Direction, Word } from '../../../../common/word';

@Injectable()
export class ValidationMediatorService {

    public constructor(private gridService: GridService,
                       private definitionService: DefinitionsService,
                       private wordService: WordService) { }


    public onSelect(definition: string): void {
        this.wordService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public keyUp(keyCode: number, row: number, column: number): void {
        if (this.wordService.selectedWord.direction === Direction.HORIZONTAL &&
            this.wordService.selectedWord.column + this.wordService.selectedWord.value.length - 1 !== column) {

            this.gridService.focusOnSelectedWord();
        } else if (this.wordService.selectedWord.row + this.wordService.selectedWord.value.length - 1 !== row) {
            this.gridService.focusOnSelectedWord();
        }

        if (this.gridService.isValidatedWord(this.wordService.selectedWord)) {
            this.gridService.updateValidatedCells(this.wordService.selectedWord);
            this.updateValidatedWords(this.wordService.selectedWord);
        }

        this.validatePerpendicularWord(this.wordService.selectedWord.direction, row, column);
    }

    private updateValidatedWords(word: Word): void {
        if (this.wordService.selectedWord !== null && this.gridService.isValidatedWord(word)) {
            horizontal_loop:
            for (let i: number = 0; i < this.definitionService.horizontalDefinitions.length; i++) {
                for (let j: number = 0; j < this.definitionService.horizontalDefinitions[i].length; j++) {
                    if (word.definition === this.definitionService.horizontalDefinitions[i][j]) {
                        this.definitionService.isValidatedHorizontalDefinition[i][j] = true;
                        break horizontal_loop;
                    }
                }
            }
            vertical_loop:
            for (let i: number = 0; i < this.definitionService.verticalDefinitions.length; i++) {
                for (let j: number = 0; j < this.definitionService.verticalDefinitions[i].length; j++) {
                    if (word.definition === this.definitionService.verticalDefinitions[i][j]) {
                        this.definitionService.isValidatedVerticalDefinition[i][j] = true;
                        break vertical_loop;
                    }
                }
            }
        }
    }

    private validatePerpendicularWord(direction: Direction, row: number, column: number): void {
        for (const word of this.wordService.words) {
            if (direction === Direction.HORIZONTAL && word.direction === Direction.VERTICAL) {
                if (word.column === column) {
                    if (word.row <= row && word.row + word.value.length - 1 >= row) {
                        if (this.gridService.isValidatedWord(word)) {
                            this.gridService.updateValidatedCells(word);
                            this.updateValidatedWords(word);
                        }
                        break;
                    }
                }
            } else if (word.direction === Direction.HORIZONTAL) {
                if (word.row === row) {
                    if (word.column <= column && word.column + word.value.length - 1 >= column) {
                        if (this.gridService.isValidatedWord(word)) {
                            this.gridService.updateValidatedCells(word);
                            this.updateValidatedWords(word);
                        }
                        break;
                    }
                }
            }
        }
    }

}
