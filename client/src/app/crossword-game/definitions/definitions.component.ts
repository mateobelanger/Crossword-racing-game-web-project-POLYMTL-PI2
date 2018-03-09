import { Component } from '@angular/core';
import { ValidationMediatorService } from '../validation-mediator.service';
import { DefinitionsService } from '../definitions.service';


@Component({
    selector: 'app-definitions',
    templateUrl: './definitions.component.html',
    styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
    private isCheatMode: boolean;
    public constructor(private validationMediatorService: ValidationMediatorService, private definitionsService: DefinitionsService) {
        this.definitionsService.initialize();
        this.isCheatMode = false;
    }

    public onSelect(definition: string): void {
        this.validationMediatorService.onSelect(definition);
    }
    // TODO: Should it be private or public?
    public switchMode(): void {
        this.isCheatMode = !this.isCheatMode;
    }

}
