import { DatamuseResponse } from "./IDatamuseResponse";
import { IWord } from "../../../common/crosswordsInterfaces/word";
import { MIN_WORD_LENGTH, WHITE_CELL as ANY_CHAR } from "../crossword-game/gridGenerator";
import { WORDS } from "./words";
import { Helper } from "./helper";
import { INVALID_DOUBLES } from "./invalidDoubles";
import { INVALID_TRIPLES } from "./invalidTriples";

export const MAX_WORDS_PER_RESPONSE: number = 250;

export class WordSelector {
    private static invalidDoubles: Set<string> = Helper.arrayToSet(INVALID_DOUBLES);
    private static invalidTriples: Set<string> = Helper.arrayToSet(INVALID_TRIPLES);

    public static getWords(template: string): Array<string> {
        if (this.containsImpossibleCombinations(template, 2) ||
            this.containsImpossibleCombinations(template, 3)) {
            return [];
        }
        const positions: number[] = [];
        for (let i: number = 0; i < template.length; i++) {
            if (template[i] === ANY_CHAR) {
                continue;
            }
            positions.push(i);
        }
        const words: string[] = WORDS[template.length - MIN_WORD_LENGTH];
        if (positions.length === 0) {
            return Helper.shuffle(words.splice(0, MAX_WORDS_PER_RESPONSE));
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
            }
        }

        return Helper.shuffle(validWords).splice(0, MAX_WORDS_PER_RESPONSE);
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

    public static containsImpossibleCombinations (template: string, sizeCombination: number = 2): boolean {
        let currentIndex: number = 0;
        while (currentIndex <= template.length - sizeCombination) {
            while (template[currentIndex] === "-" || template[currentIndex + 1] === "-" ) { currentIndex++; }
            switch (sizeCombination) {
                case 2:
                    if (this.invalidDoubles.has(template.substr(currentIndex, 2))) { 
                        return true; 
                    }
                    currentIndex++;
                    break;
                case 3:
                    if (template[currentIndex + 1] !== "-" && template[currentIndex + 2] !== "-") {
                        if (this.invalidTriples.has(template.substr(currentIndex, 3))) { 
                            return true; 
                        }
                    }
                    currentIndex++;
                    break;
                default:
                    break;
            }
        }

        return false;
    }

    private static datamuseResponseToWord ( datamuseResponse: DatamuseResponse, definitionIndex: number): IWord {
        return { value: datamuseResponse.word, definition: datamuseResponse.defs[definitionIndex] };
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
