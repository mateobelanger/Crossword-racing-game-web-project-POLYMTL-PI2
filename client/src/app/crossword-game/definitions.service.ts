import { Injectable } from '@angular/core';

@Injectable()
export class DefinitionsService {
    public isValidatedHorizontalDefinition: boolean[][];
    public isValidatedVerticalDefinition: boolean[][];
}
