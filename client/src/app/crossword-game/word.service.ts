import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GridWord, Direction } from "../../../../common/crosswordsInterfaces/word";
import { words as mockWords } from "./mock-words";
import { GRID_SIZE } from "../../../../common/constants";


export const GRID_GENERATOR_URL: string = "http://localhost:3000/service/gridgenerator/";

@Injectable()
export class WordService {
    private _words: GridWord[];

    public constructor(private _http: HttpClient) {
        this._words = [];
    }

    public get words(): GridWord[] {
        return this._words;
    }

    public set words(words: GridWord[]) {
        this._words = words;
    }

    // public method to be initialized only once the words are fetched from the server.
    public async initialize(difficulty: string = "easy"): Promise<void> {
        await this.fetchWords(difficulty)
                .then((httpWords: GridWord[]) => { this._words = this.castHttpToGridWordObj(httpWords); })
                .catch(() => { this._words = mockWords; });  // default grid if any problem occurs.
    }

    public getDefinitions(direction: Direction): string[][] {
        const definitions: string[][] = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            definitions.push([]);
        }

        for (const word of this._words) {
            if (word.direction !== direction) {
                continue;
            }
            if (direction === Direction.HORIZONTAL) {
                definitions[word.row].push(word.definition);
            } else {
                definitions[word.column].push(word.definition);
            }
        }

        return definitions;
    }

    public getWordWithDefinition(definition: string): string {
        for (const word of this._words) {
            if (word.definition === definition) {
                return word.value;
            }
        }

        return "";
    }

    private async fetchWords(difficulty: string): Promise<GridWord[]> {
        return this._http.get<GridWord[]>(GRID_GENERATOR_URL + difficulty).toPromise();
    }

    // The http response doesn't send actual GridWords object (ie. methods don't exist)
    private castHttpToGridWordObj(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }
}
