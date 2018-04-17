import { GridWord } from "../crosswordsInterfaces/word";

export function castHttpToGridWords(httpWords: GridWord[]): GridWord[] {
    const words: GridWord[] = [];
    for (const word of httpWords) {
        words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
    }

    return words;
}

export function castHttpToArrayOfGridWords(arrayOfGridWords: GridWord[][]): GridWord[][] {
    const arrayOfWords: GridWord[][] = [];
    for (const words of arrayOfGridWords) {
        arrayOfWords.push(castHttpToGridWords(words));
    }

    return arrayOfWords;
}
