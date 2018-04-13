import { Component } from "@angular/core";
import { WordService } from "../word.service";
import { ValidatorService } from "../validator.service";
import { Direction } from "../../../../../common/crosswordsInterfaces/word";
import { GridService } from "../grid.service";
import { SelectionService } from "../selection/selection.service";

@Component({
    selector: "app-definitions",
    templateUrl: "./definitions.component.html",
    styleUrls: ["./definitions.component.css"]
})
export class DefinitionsComponent {
    private isCheatMode: boolean;
    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];

    public constructor(private selectionService: SelectionService,
                       private wordService: WordService,
                       private validatorService: ValidatorService,
                       private gridService: GridService) {}


    public onSelect(definition: string): void {
        this.selectionService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public getHorizontalDefinitions(): String[][] {
        return this.wordService.getDefinitions(Direction.HORIZONTAL);
    }

    public getVerticalDefinitions(): String[][] {
        return this.wordService.getDefinitions(Direction.VERTICAL);
    }

    public isHostValidatedDefinition(definition: string): boolean {
        return this.validatorService.isHostValidatedDefinition(definition);
    }

    public isGuestValidatedDefinition(definition: string): boolean {
        return this.validatorService.isGuestValidatedDefinition(definition);
    }

    public isSelectedDefinition(defintion: string): boolean {
        return this.selectionService.definition === defintion;
    }

    public switchMode(): void {
        this.isCheatMode = !this.isCheatMode;
    }

}
