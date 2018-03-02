import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';


export const words: GridWord[] = [
    { row: 0, column: 0, direction: Direction.HORIZONTAL, value: "sit", definition: "I like to . . . on my chair." },
    { row: 0, column: 5, direction: Direction.HORIZONTAL, value: "value", definition: "The word is value." },
    { row: 0, column: 0, direction: Direction.VERTICAL, value: "sat", definition: "I . . . on a chair." },
    { row: 0, column: 1, direction: Direction.VERTICAL, value: "image", definition: "JPEG, PNG, GIF" },
    { row: 0, column: 2, direction: Direction.VERTICAL, value: "tom", definition: ". . . a la ferme." },
    { row: 1, column: 0, direction: Direction.HORIZONTAL, value: "amour", definition: "Michel est notre . . . . ." },
    { row: 2, column: 0, direction: Direction.HORIZONTAL, value: "tam", definition: "TAM . . ." },
    { row: 3, column: 5, direction: Direction.VERTICAL, value: "airport", definition: "AIRPORT" }
];
