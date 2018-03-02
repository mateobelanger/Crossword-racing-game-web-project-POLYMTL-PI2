import { Injectable } from '@angular/core';
import { WordService } from './word.service';
import { Direction, GridWord } from '../../../../common/crosswordsInterfaces/word';

@Injectable()
export class DefinitionsService {

    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];
    public isValidatedHorizontalDefinition: boolean[][];
    public isValidatedVerticalDefinition: boolean[][];

    public constructor(private wordService: WordService) {
        this.horizontalDefinitions = this.wordService.getDefinitions(Direction.HORIZONTAL);
        this.verticalDefinitions = this.wordService.getDefinitions(Direction.VERTICAL);
        this.isValidatedHorizontalDefinition = [];
        this.isValidatedVerticalDefinition = [];
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

    public isValidatedDefinition(word: GridWord): boolean {
        let definitions: string[];
        let isValidatedDefinitions: boolean[];

        if (word.direction === Direction.HORIZONTAL) {
            definitions = this.horizontalDefinitions[word.row];
            isValidatedDefinitions = this.isValidatedHorizontalDefinition[word.row];
        } else {
            definitions = this.verticalDefinitions[word.column];
            isValidatedDefinitions = this.isValidatedVerticalDefinition[word.column];
        }

        for (let i: number = 0; i < definitions.length; i++) {
            if (definitions[i] === word.definition) {
                return isValidatedDefinitions[i];
            }
        }

        return false;
    }
}
