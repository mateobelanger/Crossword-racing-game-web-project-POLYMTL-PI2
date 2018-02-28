import { Component } from '@angular/core';
import { ValidationMediatorService } from '../validation-mediator.service';
import { DefinitionsService } from '../definitions.service';


@Component({
    selector: 'app-definitions',
    templateUrl: './definitions.component.html',
    styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {

    public constructor(private validationMediatorService: ValidationMediatorService, private definitionsService: DefinitionsService) {
        this.definitionsService.initialize();
    }

    public onSelect(definition: string): void {
        this.validationMediatorService.onSelect(definition);
    }

}
