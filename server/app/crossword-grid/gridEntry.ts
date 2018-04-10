import { GridWord, Direction } from "../../../common/crosswordsInterfaces/word";

export class GridEntry extends GridWord {
    public weight: number;

    public constructor(word: GridWord) {
        super(word.row, word.column, word.direction, word.value);
        this.weight = 0;
    }

    public crosses(entry: GridEntry): boolean {
        if (this.direction === entry.direction) {
            return false;
        }

        let verticalWord: GridEntry;
        let horizontalWord: GridEntry;
        if (this.direction === Direction.HORIZONTAL) {
            horizontalWord = this;
            verticalWord = entry;
        } else {
            horizontalWord = entry;
            verticalWord = this;
        }

        return verticalWord.column >= horizontalWord.column &&
               verticalWord.column < horizontalWord.column + horizontalWord.size &&
               verticalWord.row <= horizontalWord.row &&
               verticalWord.row + verticalWord.size > horizontalWord.row;
    }
}
