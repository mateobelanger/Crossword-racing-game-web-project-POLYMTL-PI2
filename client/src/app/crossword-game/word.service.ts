import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { words as mockWords } from "./mock-words";
import { GRID_SIZE } from '../../../../common/constants';

export const GRID_GENERATOR_URL: string = "http://localhost:3000/service/gridgenerator/";

@Injectable()
export class WordService {
    public words: GridWord[];
    private _selectedWord: GridWord;

    public constructor(private _http: HttpClient) {
        this.words = [];
        this._selectedWord = null;
    }

    public get selectedWord(): GridWord {
        return this._selectedWord;
    }
    
    public get definition(): string {
        if (this._selectedWord === null) {
            return null;
        }
        
        return this._selectedWord.definition;
    }
    
    public set definition(definition: string) {
        for (const word of this.words) {
            if (word.definition === definition) {
                this._selectedWord = word;
                break;
            }
        }
    }

    public async initialize(difficulty: string = "easy"): Promise<void> {
        await this.fetchWords(difficulty) 
                .then(words => { this.words = words; })
                .catch(() => { this.words = mockWords; });  // default grid if any problem occurs.
    }
    
    public selectWord(row: number, column: number): void {
        for (const word of this.words) {
            if (word === this._selectedWord) {
                continue;
            }
            if (word.includesCell(row, column)) {
                this._selectedWord = word;
                break;
            }
        }
    }
    
    public getDefinitions(direction: Direction): string[][] {
        const definitions: string[][] = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            definitions.push([]);
        }
        
        for (const word of this.words) {
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
    
    public deselect(): void {
        this._selectedWord = null;
    }

    private fetchWords(difficulty: string = "easy"): Promise<GridWord[]> {
        return this._http.get<GridWord[]>(GRID_GENERATOR_URL + difficulty).toPromise();
    }
}
