import { Component } from '@angular/core';
import { DefinitionsService } from '../definitions.service';
import { WordService } from '../word.service';
import { GridService } from '../grid.service';
import { Direction } from '../../../../../common/word';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {

    public constructor(private wordService: WordService, private gridService: GridService, private definitionsService: DefinitionsService) {
      this.horizontalDefinitions = this.wordService.getDefinitions(Direction.HORIZONTAL);
      this.verticalDefinitions = this.wordService.getDefinitions(Direction.VERTICAL);

      this.definitionsService.isValidatedHorizontalDefinition = [];
      for (const row of this.horizontalDefinitions) {
        const rowCon: boolean[] = [];
        for (let i: number = 0; i < row.length; i++) {
          rowCon.push(false);
        }
        this.definitionsService.isValidatedHorizontalDefinition.push(rowCon);
      }
      this.definitionsService.isValidatedVerticalDefinition = [];
      for (const column of this.verticalDefinitions) {
        const columnCon: boolean[] = [];
        for (let i: number = 0; i < column.length; i++) {
          columnCon.push(false);
        }
        this.definitionsService.isValidatedVerticalDefinition.push(columnCon);
      }
    }

    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];

    public onSelect(definition: string): void {
      this.wordService.definition = definition;
      this.gridService.focusOnSelectedWord();
    }

    public isSelectedDefinition(definition: string): boolean {
      return definition === this.wordService.definition;
    }

}
