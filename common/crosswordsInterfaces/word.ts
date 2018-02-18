export enum Direction {VERTICAL,HORIZONTAL};

export interface IWord {
    value: string;
    definition: string;
}

export class Word implements IWord {
    value: string;
    definition: string;

    constructor(value: string, definition: string) {
        this.value = value;
        this.definition = definition;
    }
}

export class GridEntry {
    public word: Word;
    public row: number;
    public column: number;
    public direction: Direction;
    public weight: number;

    public constructor(row: number, column: number, direction: Direction, value: string, definition: string) {
        this.row = row;
        this.column = column;
        this.direction = direction;
        this.weight = 0;
        this.word = new Word(value, definition);
    }

    public crosses(entry: GridEntry): boolean {
        if (this.direction === entry.direction) {
            return false;
        }
        let v_word: GridEntry;
        let h_word: GridEntry;
        if (this.direction === Direction.HORIZONTAL) {
            h_word = this;
            v_word = entry;
        } else {
            h_word = entry;
            v_word = this;
        }

        return v_word.column >= h_word.column && v_word.column < h_word.column + h_word.word.value.length &&
               v_word.row <= h_word.row && v_word.row + v_word.word.value.length > h_word.row;
       
    }
}
