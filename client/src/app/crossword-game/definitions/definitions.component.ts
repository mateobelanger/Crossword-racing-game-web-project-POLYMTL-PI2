import { Component } from "@angular/core";
import { ValidatorService } from "../validator.service";
import { GridService } from "../grid.service";
import { SelectionService } from "../selection/selection.service";
import { DefinitionsService } from "./definitions.service";

@Component({
    selector: "app-definitions",
    templateUrl: "./definitions.component.html",
    styleUrls: ["./definitions.component.css"]
})
export class DefinitionsComponent {
    private isCheatMode: boolean;

    public constructor(private selectionService: SelectionService,
                       private validatorService: ValidatorService,
                       private gridService: GridService,
                       private definitionsService: DefinitionsService) {

    }

    public onSelect(definition: string): void {
        this.selectionService.definition = definition;
        this.gridService.focusOnSelectedWord();
    }

    public get horizontalDefinitions(): string[][] {
        return this.definitionsService.horizontalDefinitions;
    }

    public get verticalDefinitions(): string[][] {
        return this.definitionsService.verticalDefinitions;
    }

    public getWordWithDefinition(definition: string): string {
        return this.definitionsService.getWordWithDefinition(definition);
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
