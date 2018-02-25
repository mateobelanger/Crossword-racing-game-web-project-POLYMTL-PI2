import { Word, Direction } from '../../../../common/word';


export const words: Word[] = [
    {row: 0, column: 5, direction: Direction.HORIZONTAL, size: 5, value: "value", definition: "The word is value." },
    { row: 0, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "sit", definition: "I like to . . . on my chair." },
    { row: 0, column: 0, direction: Direction.VERTICAL, size: 3, value: "sat", definition: "I . . . on a chair." },
    { row: 0, column: 1, direction: Direction.VERTICAL, size: 5, value: "image", definition: "JPEG, PNG, GIF" },
    { row: 0, column: 2, direction: Direction.VERTICAL, size: 3, value: "tom", definition: ". . . a la ferme." },
    { row: 1, column: 0, direction: Direction.HORIZONTAL, size: 5, value: "amour", definition: "Michel est notre . . . . ." },
    { row: 2, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "tam", definition: "TAM . . ." }
];
