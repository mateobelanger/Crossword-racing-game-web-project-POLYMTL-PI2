import { Component } from '@angular/core';
import { WordService } from '../word.service';
import { ValidatorService } from '../validator.service';
import { Direction } from '../../../../../common/crosswordsInterfaces/word';
import { GridService } from '../grid.service';


@Component({
    selector: 'app-definitions',
    templateUrl: './definitions.component.html',
    styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
    private isCheatMode: boolean;
    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];

    public constructor(private wordService: WordService, private validatorService: ValidatorService, private gridService: GridService) {
        this.horizontalDefinitions = wordService.getDefinitions(Direction.HORIZONTAL);
        this.verticalDefinitions = wordService.getDefinitions(Direction.VERTICAL);
    }

    public onSelect(definition: string): void {
        this.wordService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public isValidatedDefinition(definition: string): boolean {
        return this.validatorService.isValidatedDefinition(definition);
    }

    public isSelectedDefinition(defintion: string): boolean {
        return this.wordService.definition === defintion;
    }
    // TODO: Should it be private or public?
    public switchMode(): void {
        this.isCheatMode = !this.isCheatMode;
    }

}
