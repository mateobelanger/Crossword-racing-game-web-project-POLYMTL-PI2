import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { Direction, Word } from '../../../../common/word';

@Injectable()
export class DefinitionsService {

    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];
    public isValidatedHorizontalDefinition: boolean[][];
    public isValidatedVerticalDefinition: boolean[][];

    public constructor(private wordService: WordService) {
        this.horizontalDefinitions = this.wordService.getDefinitions(Direction.HORIZONTAL);
        this.verticalDefinitions = this.wordService.getDefinitions(Direction.VERTICAL);
    }

    public initialize(): void {
        this.isValidatedHorizontalDefinition = [];
        for (const row of this.horizontalDefinitions) {
            const rowCon: boolean[] = [];
            for (let i: number = 0; i < row.length;) {
                i++;
                rowCon.push(false);
            }
            this.isValidatedHorizontalDefinition.push(rowCon);
        }
        this.isValidatedVerticalDefinition = [];
        for (const column of this.verticalDefinitions) {
            const columnCon: boolean[] = [];
            for (let i: number = 0; i < column.length;) {
                i++;
                columnCon.push(false);
            }
            this.isValidatedVerticalDefinition.push(columnCon);
        }
    }

    public isSelectedDefinition(definition: string): boolean {
        return definition === this.wordService.definition;
    }


    public isValidatedDefinition(selectedWord: Word): boolean {
        let isValid: boolean = true;
        const rowIndex: number = selectedWord.row;
        const columnIndex: number = selectedWord.column;

        for (let i: number = 0; i < selectedWord.value.length && isValid; i++) {
            selectedWord.direction === Direction.HORIZONTAL ?
                isValid = (this.isValidatedHorizontalDefinition[rowIndex][columnIndex + i]) :
                isValid = (this.isValidatedVerticalDefinition[rowIndex + i][columnIndex]);
        }

        return isValid;
    }
}
