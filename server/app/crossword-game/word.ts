export const VERTICAL = "vertical";
export const HORIZONTAL = "horizontal";

export class Word {
    public row: number;
    public column: number;
    public direction: string;
    public size: number;

    public value: string;
    public definition: string;

    public constructor () {}
}

export class GridEntry {
    public word: Word;
    public weight: number;

    public constructor(word: Word) {
        this.word = word;
        this.weight = 0;
    }

    public crosses(entry: GridEntry): boolean {
        if (this.word.direction === entry.word.direction) {
            return false;
        }
        let v_word: Word;
        let h_word: Word;
        if (this.word.direction === HORIZONTAL) {
            h_word = this.word;
            v_word = entry.word
        } else {
            h_word = entry.word;
            v_word = this.word;
        }

        return v_word.column >= h_word.column && v_word.column < h_word.column + h_word.size &&
               v_word.row <= h_word.row && v_word.row + v_word.size > h_word.row;
       
    }
}
