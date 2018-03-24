import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

// tslint:disable:no-magic-numbers
export const words: GridWord[] = [
    new GridWord(0, 0, Direction.HORIZONTAL, "sit", "I like to . . . on my chair."),
    new GridWord(0, 5, Direction.HORIZONTAL, "value", "The word is value."),
    new GridWord(0, 0, Direction.VERTICAL, "sat", "I . . . on a chair."),
    new GridWord(0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF"),
    new GridWord(0, 2, Direction.VERTICAL, "tom", ". . . a la ferme."),
    new GridWord(1, 0, Direction.HORIZONTAL, "amour", "Michel est notre . . . . ."),
    new GridWord(2, 0, Direction.HORIZONTAL, "tam", "TAM . . ."),
    new GridWord(3, 5, Direction.VERTICAL, "airport", "AIRPORT")
];
