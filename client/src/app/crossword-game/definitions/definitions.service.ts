import { Injectable } from "@angular/core";
import { WordService } from "../word.service";
import { Direction } from "../../../../../common/crosswordsInterfaces/word";

@Injectable()
export class DefinitionsService {

    private _horizontalDefinitions: string[][];
    private _verticalDefinitions: string[][];

    public constructor(private wordService: WordService) {
        this._verticalDefinitions = [];
        this._horizontalDefinitions = [];
    }

    public initialize(): void {
        this._horizontalDefinitions = this.wordService.getDefinitions(Direction.HORIZONTAL);
        this._verticalDefinitions = this.wordService.getDefinitions(Direction.VERTICAL);
    }

    public get horizontalDefinitions(): string[][] {
        return this._horizontalDefinitions;
    }

    public get verticalDefinitions(): string[][] {
        return this._verticalDefinitions;
    }

    public getWordWithDefinition(definition: string): string {
        return this.wordService.getWordWithDefinition(definition);
    }
}
