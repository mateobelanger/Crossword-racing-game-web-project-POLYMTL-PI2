import { DatamuseResponse } from "./IDatamuseResponse";
import { IWord } from "../../../common/crosswordsInterfaces/word";
import { MIN_WORD_LENGTH } from "../crossword-game/grid-generator";
import { WORDS } from "./words";

export const MAX_WORDS_PER_RESPONSE: number = 250;

export class WordSelector {
    public static getWords(template: string): Array<string> {
        const positions: number[] = [];
        for (let i: number = 0; i < template.length; i++) {
            if (template[i] === "-") {
                continue;
            }
            positions.push(i);
        }

        const words: string[] = this.shuffle(WORDS[template.length - MIN_WORD_LENGTH]);
        if (positions.length === 0) {
            return words.splice(0, MAX_WORDS_PER_RESPONSE);
        }
        const validWords: string[] = [];
        for (const word of words) {
            let isValid: boolean = true;
            for (const index of positions) {
                if (word[index] !== template[index]) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                validWords.push(word);
                if (validWords.length >= MAX_WORDS_PER_RESPONSE) { break; }
            }
        }

        return validWords;
    }

    public static getWordsByRarity(words: Array<DatamuseResponse>, isCommon: boolean): Array<DatamuseResponse> {
        const selectedWords: Array<DatamuseResponse> = new Array<DatamuseResponse>();

        words.forEach( (element: DatamuseResponse) => {
            if (element.isCommon() === isCommon) {
                selectedWords.push(element);
            }
        });

        return selectedWords;
    }

    public static getValidWordsByDifficulty(words: Array<DatamuseResponse>, criteria: string,
                                            isCommon: boolean, isEasy: boolean): Array<IWord> {
        const selectedWords: Array<IWord> = new Array<IWord>();
        for (const word of words) {
            const definitionIndex: number = word.findDefinitionIndex(isEasy);
            if (word.isValidWithTemplate(criteria) && word.isCommon() === isCommon && definitionIndex !== -1) {
                selectedWords.push(this.datamuseResponseToWord(word, definitionIndex));
            }
        }

        return selectedWords;
    }

    // used when array word is directly searched
    public static confirmWordByDifficulty(words: Array<DatamuseResponse>, isCommon: boolean, 
                                          isEasy: boolean, word: string): Array<IWord> {

        const selectedWords: Array<IWord> = new Array<IWord>();
        if (Object.keys(words).length === 0) {
            return selectedWords;
        }
        const element: DatamuseResponse = words[0];
        const definitionIndex: number = element.findDefinitionIndex(isEasy);
        if (element.isValidWithTemplate(word) &&
            element.isCommon() === isCommon && definitionIndex !== -1) {

            selectedWords.push(this.datamuseResponseToWord(element, definitionIndex));
        }

        return selectedWords;
    }

    private static datamuseResponseToWord ( datamuseResponse: DatamuseResponse, definitionIndex: number): IWord {
        return { value: datamuseResponse.word, definition: datamuseResponse.defs[definitionIndex] };
    }

    private static shuffle(array: Array<string>): Array<string> {
        for (let i: number = array.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    /*
     private static readData(datamuseResponse: DatamuseResponse): Word {
        let word: Word;
        word.row = NO_VALUE;
        word.column = NO_VALUE;
        word.value = datamuseResponse.word;

        return seperatedWords;
     } */

}
