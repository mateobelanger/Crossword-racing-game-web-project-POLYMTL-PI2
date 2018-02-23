import { Component } from '@angular/core';
import { WordService } from '../word.service';
import { Direction } from '../../../../../common/word';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];
    public isValidatedHorizontalDefinition: boolean[][];
    public isValidatedVerticalDefinition: boolean[][];

    public constructor(private wordService: WordService, private gridService: GridService) {
        this.horizontalDefinitions = this.wordService.getDefinitions(Direction.HORIZONTAL);
        this.verticalDefinitions = this.wordService.getDefinitions(Direction.VERTICAL);
        this.isValidatedHorizontalDefinition = [];
        for (const row of this.horizontalDefinitions) {
            const rowCon: boolean[] = [];
            for (let i: number = 0; i < row.length; i++) {
                rowCon.push(false);
            }
            this.isValidatedHorizontalDefinition.push(rowCon);
        }
        this.isValidatedVerticalDefinition = [];
        for (const column of this.verticalDefinitions) {
            const columnCon: boolean[] = [];
            for (let i: number = 0; i < column.length; i++) {
                columnCon.push(false);
            }
            this.isValidatedVerticalDefinition.push(columnCon);
        }
    }

    public onSelect(definition: string): void {
        this.wordService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public updateValidatedWords(): void {
        if (this.wordService.selectedWord !== null && this.gridService.validateWord(this.wordService.selectedWord)) {
            horizontal_loop:
            for (let i: number = 0; i < this.horizontalDefinitions.length; i++) {
                for (let j: number = 0; j < this.horizontalDefinitions[i].length; j++) {
                    if (this.wordService.definition === this.horizontalDefinitions[i][j]) {
                        this.isValidatedHorizontalDefinition[i][j] = true;
                        break horizontal_loop;
                    }
                }
            }
            vertical_loop:
            for (let i: number = 0; i < this.verticalDefinitions.length; i++) {
                for (let j: number = 0; j < this.verticalDefinitions[i].length; j++) {
                    if (this.wordService.definition === this.verticalDefinitions[i][j]) {
                        this.isValidatedVerticalDefinition[i][j] = true;
                        break vertical_loop;
                    }
                }
            }
        }
    }

    public isSelectedDefinition(definition: string): boolean {
        return definition === this.wordService.definition;
    }

}
