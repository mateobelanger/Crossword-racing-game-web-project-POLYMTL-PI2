import { GridWord, Direction } from "../../../common/crosswordsInterfaces/word";

export class GridEntry {
    public word: GridWord;
    public weight: number;

    public constructor(word: GridWord) {
        this.word = word;
        this.weight = 0;
    }

    public crosses(entry: GridEntry): boolean {
        if (this.word.direction === entry.word.direction) {
            return false;
        }

        let verticalWord: GridEntry;
        let horizontalWord: GridEntry;
        if (this.word.direction === Direction.HORIZONTAL) {
            horizontalWord = this;
            verticalWord = entry;
        } else {
            horizontalWord = entry;
            verticalWord = this;
        }

        return verticalWord.word.column >= horizontalWord.word.column &&
               verticalWord.word.column < horizontalWord.word.column + horizontalWord.word.size &&
               verticalWord.word.row <= horizontalWord.word.row &&
               verticalWord.word.row + verticalWord.word.size > horizontalWord.word.row;
    }
}
