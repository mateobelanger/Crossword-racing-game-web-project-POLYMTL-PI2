import { Injectable } from '@angular/core';

@Injectable()
export class WordSelectionService {
    private selectedDefinition: string;

    public constructor() {
        this.deselect();
    }

    public setDefinition(definition: string): void {
        this.selectedDefinition = definition;
    }

    public getDefinition(): string {
        return this.selectedDefinition;
    }

    public deselect(): void {
        this.selectedDefinition = "";
    }

}
