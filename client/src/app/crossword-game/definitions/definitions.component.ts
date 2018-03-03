import { Component } from '@angular/core';
import { WordService } from '../word.service';
import { ValidatorService } from '../validator.service';
import { Direction } from '../../../../../common/crosswordsInterfaces/word';


@Component({
    selector: 'app-definitions',
    templateUrl: './definitions.component.html',
    styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];

    public constructor(private wordService: WordService, private validatorService: ValidatorService) {
        this.horizontalDefinitions = wordService.getDefinitions(Direction.HORIZONTAL);
        this.verticalDefinitions = wordService.getDefinitions(Direction.VERTICAL);
    }

    public onSelect(definition: string): void {
        this.wordService.definition = definition;
    }

    public isValidatedDefinition(definition: string): boolean {
        return this.validatorService.isValidatedDefinition(definition);
    }

    public isSelectedDefinition(defintion: string): boolean {
        return this.wordService.definition === defintion;
    }

}
