import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { DefinitionsService } from './definitions.service';
import { WordService } from './word.service';
import { Direction, Word } from '../../../../common/word';

@Injectable()
export class SelectionMediatorService {

    public constructor(private gridService: GridService,
        private definitionService: DefinitionsService,
        private wordService: WordService) { }

    public init(): void { } // TODO 

    public keyUp(keyCode: number, row: number, column: number): void {
        const word: Word = this.wordService.selectedWord;
        if (word.direction === Direction.HORIZONTAL &&
            word.column + word.value.length - 1 !== column) {

            this.gridService.focusOnSelectedWord();
        } else if (word.row + word.value.length - 1 !== row) {
            this.gridService.focusOnSelectedWord();
        }

        if (this.gridService.validateWord(word)) {
            this.gridService.updateValidatedCells(word);
            this.updateValidatedWords(word);
        }
        this.validatePerpendicularWord(word.direction, row, column);
    }

    public onSelect(definition: string): void {
        this.wordService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public updateValidatedWords(word: Word): void {
        if (this.wordService.selectedWord !== null && this.gridService.validateWord(word)) {
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

    public validatePerpendicularWord(direction: Direction, row: number, column: number): void {
        for (const word of this.wordService.words) {
            if ( direction === Direction.HORIZONTAL && word.direction === Direction.VERTICAL) {
                if (word.column === column) {
                    if (word.row <= row && word.row + word.value.length - 1 >= row) {
                        if (this.gridService.validateWord(word)) {
                            this.gridService.updateValidatedCells(word);
                            this.updateValidatedWords(word);
                        }
                        break;
                    }
                }
            } else if (word.direction === Direction.HORIZONTAL) {
                if (word.row === row) {
                    if (word.column <= column && word.column + word.value.length - 1 >= column) {
                        if (this.gridService.validateWord(word)) {
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
