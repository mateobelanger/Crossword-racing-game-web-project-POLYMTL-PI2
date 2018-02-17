import { Component } from '@angular/core';
import { WordService } from '../word.service';
import { Direction } from '../../../../../common/word'

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
    public horizontalDefinitions: string[][];
    public verticalDefinitions: string[][];

    public constructor(private wordService: WordService) {
        this.horizontalDefinitions = this.wordService.getDefinitions(Direction.Horizontal);
        this.verticalDefinitions = this.wordService.getDefinitions(Direction.Vertical);
    }

    public onSelect(def: string): void {
        this.wordService.definition = def;
    }

    public getSelectedDefinition(): string {
        return this.wordService.definition;
    }

}
