import { Word } from "./word";
//import { LexicalService } from "../lexicalService/lexicalService";
import { DatamuseService } from "../lexicalService2/datamuseService";

export const MIN_WORD_LENGTH: number = 1;
export const DEFAULT_GRID_SIZE: number = 4;

export const BLACK_CASE: string = "#";
export const WHITE_CASE: string = "-";



export class GridGenerator {
    private nRows: number;
    private nColumns: number;
    private _grid: string[][];
    private indicesToUseForResults: number[];

    public constructor() {
        this._grid = [];
        this.indicesToUseForResults = [];
    }

    public generate(nRows: number = DEFAULT_GRID_SIZE,
                    nColumns: number = DEFAULT_GRID_SIZE,
                    nBlackCases: number,
                    difficulty: string): Word[] {

        this.initialize(nRows, nColumns);
        this.fill(nBlackCases);
        this.fix();
        console.log("fix works");

        let emptyGrid: Word[] = [];
        for (let i: number = 0; i < this.nRows; i++) {
            const row: string[] = this._grid[i];
            emptyGrid = emptyGrid.concat(this.generateEmptyWords(row, i, "horizontal"));
            const column: string[] = this.getColumn(i);
            emptyGrid = emptyGrid.concat(this.generateEmptyWords(column, i, "vertical"));
        }
        emptyGrid.sort((word1: Word, word2: Word) => {
            return word1.size - word2.size;
        });

        const filledGrid: Word[] = [];

        this.indicesToUseForResults.push(0);        //
        this.placeWords(emptyGrid, filledGrid, difficulty);     //** difficulty: à lier à configurer une partie.. attribut ? */
        console.log("goes through placeWords");

        //while(filledGrid.length === 0){};
        
        console.log("devrait s'imprimer en dernier..");

        console.log("nombre de mots dans la grille: " + filledGrid.length);


        return filledGrid;
    }


    async placeWords(emptyWords: Word[], filledWords: Word[], difficulty: string): Promise<any> {
        if (emptyWords.length === 0) {
            return "done";
        }
        const wordToPlace: Word = emptyWords.pop();
        let wordSkeleton: string;
        for (let i: number = 0; i < wordToPlace.size; i++) {
            if (wordToPlace.direction === "horizontal") {
                wordSkeleton += this._grid[wordToPlace.row][wordToPlace.column + i];
            } else {
                wordSkeleton += this._grid[wordToPlace.row + i][wordToPlace.column];
            }
        }
        
        let datamuse: DatamuseService = new DatamuseService();
        // let reader: JsonReader = new JsonReader();
        // let json: JSON;
        await datamuse.requestWordInfo(wordSkeleton, difficulty)
            .then( () => {
                console.log("test4");
                console.log(datamuse.requestData[0]);

                let lastItem = this.indicesToUseForResults.length - 1;
                let indexToUse = this.indicesToUseForResults[lastItem];
                    
                if (datamuse.requestData === null || this.indicesToUseForResults[lastItem] === Object.keys(datamuse.requestData).length ) {
                    emptyWords.push(wordToPlace);
                    emptyWords.push(filledWords.pop());
                    this.indicesToUseForResults.pop();
                    
                } else if (this.isInGrid(datamuse.requestData[indexToUse].name, filledWords)){
                    
                    emptyWords.push(wordToPlace);
                    emptyWords.push(filledWords.pop());
                    this.indicesToUseForResults[lastItem]++;
                // traiter les cas ou le ++ depasse le nombre de mots du json (?) et
                //  cas ou toutes les possibilite ont ete traitees sans succes?
                    
                } else {
                    wordToPlace.value = datamuse.requestData[this.indicesToUseForResults[lastItem]].name;
                    wordToPlace.definition = datamuse.requestData[indexToUse].definitions[datamuse.requestData[indexToUse].definitionIndex];

                    console.log("testData");
                    console.log(wordToPlace);

                    filledWords.push(wordToPlace);
                    this.indicesToUseForResults[this.indicesToUseForResults.length - 1]++;
                    this.indicesToUseForResults.push(0);
                   
                }
 
                return this.placeWords(emptyWords, filledWords, difficulty);
            });


    }

    private isInGrid(searchedWord: string, words: Word[]): boolean {

        /*words.forEach(word => {
            if(word.value === searchedWord) {
                return true;
            }
        });*/

        return false;
    }


    public get grid(): string[][] {
        return this._grid;
    }

    private set(row: number, col: number, value: string): void {
        if (value.length > 1) {
            return;
        }
        if (row >= this.nRows || row < 0) {
            return;
        }
        if (col >= this.nColumns || col < 0) {
            return;
        }
        this._grid[row][col] = value;
    }

    private setRandomly(value: string): void {
        if (value.length > 1) {
            return;
        }
        let column: number = 0;
        let row: number = 0;
        do {
            row = Math.floor(Math.random() * this.nRows);
            column = Math.floor(Math.random() * this.nColumns);
        } while (this.isCorner(row, column) || this._grid[row][column] === value);

        this.set(row, column, value);
    }

    // creates an array representing the column at the specified index.
    private getColumn(index: number): string[] {
        if (index < 0 || index >= this.nColumns) {
            return null;
        }
        const column: string[] = [];
        for (let row: number = 0; row < this.nRows; row++) {
            column.push(this._grid[row][index]);
        }

        return column;
    }

    private initialize(nRows: number, nCols: number): void {
        this.nRows = nRows;
        this.nColumns = nCols;

        for (let i: number = 0; i < nRows; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < nCols; j++) {
                row.push(WHITE_CASE);
            }
            this._grid.push(row);
        }
    }

    private fill(nBlackCases: number): void {
        for (let i: number = 0; i < nBlackCases; i++) {
            this.setRandomly(BLACK_CASE);
        }
    }

    private fix(): void {
        for (let i: number = 0; i < this.nRows; i++) {
            for (let j: number = 0; j < this.nColumns; j++) {
                if (this.isLoneCase(i, j)) {
                    this.fixLoneCase(i, j);
                    i = 0; j = 0;
                }
            }
            const row: string[] = this._grid[i];

            if (!this.hasWords(row)) {
                this.addWord(row);
                this.setRandomly(BLACK_CASE);
                i = 0;
            }

            const column: string[] = this.getColumn(i);
            if (!this.hasWords(column)) {
                this.addWord(column);
                for (let j: number = 0; j < column.length; j++) {
                    this._grid[i][j] = column[j];
                }
                i = 0;
            }
        }
    }

    private isCorner(row: number, col: number): boolean {
        if ((row < MIN_WORD_LENGTH || row > this.nRows - 1 - MIN_WORD_LENGTH)
            && (col < MIN_WORD_LENGTH || col > this.nColumns - 1 - MIN_WORD_LENGTH)) {
            return true;
        }

        return false;
    }

    // Returns true if a white case is surrounded by black cases.
    private isLoneCase(row: number, col: number): boolean {
        if (this._grid[row][col] === BLACK_CASE) {
            return false;
        }
        if (row > 0 && (this._grid[row - 1][col] === WHITE_CASE)) {
            return false;
        } else if (row < this.nRows - 1 && (this._grid[row + 1][col] === WHITE_CASE)) {
            return false;
        } else if (col > 0 && (this._grid[row][col - 1] === WHITE_CASE)) {
            return false;
        } else if (col < this.nColumns - 1 && (this._grid[row][col + 1] === WHITE_CASE)) {
            return false;
        }

        return true;
    }

    private fixLoneCase (row: number, col: number): void {
        if (!this.isLoneCase(row, col)) {
            return;
        }
        // shifts a black case up or left depending on the position.
        this._grid[row][col] = BLACK_CASE;
        if (col === this.nColumns - 1) {
            this._grid[row + 1][col] = WHITE_CASE;
        } else {
            this._grid[row][col + 1] = WHITE_CASE;
        }
    }

    // returns whether a row or col has words or no words in it.
    private hasWords(lane: string[]): boolean {
        let wordLength: number = 0;
        for (let i: number = 0; i < this.nColumns; i++) {
            if (lane[i] === BLACK_CASE) {
                wordLength = 0;
                continue;
            } else if (++wordLength === MIN_WORD_LENGTH) {
                return true;
            }
        }

        return false;
    }

    private addWord(lane: string[]): void {
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            if (i > 0) {
                lane[i - 1] = WHITE_CASE;
            } else {
                lane[i + 1] = WHITE_CASE;
            }
            break;
        }
    }

    private generateEmptyWords(lane: string[], index: number, direction: string): Word[] {
        const result: Word[] = [];
        for (let i: number = 0; i < lane.length; i++) {
            if (lane[i] === BLACK_CASE) {
                continue;
            }
            const word: Word = new Word();
            if (direction === "horizontal") {
                word.row = index;
                word.column = i;
            } else {
                word.row = i;
                word.column = index;
            }
            word.direction = direction;

            let length: number = 0;
            while (lane[i] === WHITE_CASE) {
                length++;
                if (++i >= lane.length) {
                    break;
                }
            }
            if (length >= MIN_WORD_LENGTH) {
                word.size = length;
                result.push(word);
            }
        }

        return result;
    }
}
