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

    public isValidatedDefinition(word: Word): boolean {
        let isValid: boolean = false;

        horizontal_loop:
        for (let i: number = 0; i < this.horizontalDefinitions.length; i++) {
            for (let j: number = 0; j < this.horizontalDefinitions[i].length; j++) {
                if (word.definition === this.horizontalDefinitions[i][j]) {
                    isValid = this.isValidatedHorizontalDefinition[i][j];
                    break horizontal_loop;
                }
            }
        }
        vertical_loop:
        for (let i: number = 0; i < this.verticalDefinitions.length; i++) {
            for (let j: number = 0; j < this.verticalDefinitions[i].length; j++) {
                if (word.definition === this.verticalDefinitions[i][j]) {
                    isValid = this.isValidatedVerticalDefinition[i][j];
                    break vertical_loop;
                }
            }
        }

        return isValid;
    }

}

