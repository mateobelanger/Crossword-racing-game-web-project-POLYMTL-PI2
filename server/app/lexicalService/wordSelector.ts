import { DatamuseResponse } from "./datamuseResponse";
import { IWord } from "../../../common/crosswordsInterfaces/word";
import { MIN_WORD_LENGTH, WHITE_CELL as ANY_CHAR } from "../crossword-game/gridCreator";
import { WORDS } from "./words";
import { ArrayHelper } from "./arrayHelper";
import { INVALID_DOUBLES } from "./invalidDoubles";
import { INVALID_TRIPLES } from "./invalidTriples";

export const MAX_WORDS_PER_RESPONSE: number = 250;
const TWO_LETTER_WORDS_LENGTH: number = 2;
const THREE_LETTER_WORDS_LENGTH: number = 3;

export class WordSelector {
    private static invalidDoubles: Set<string> = ArrayHelper.arrayToSet(INVALID_DOUBLES);
    private static invalidTriples: Set<string> = ArrayHelper.arrayToSet(INVALID_TRIPLES);

    public static getWords(template: string): string[] {
        if (this.containsImpossibleCombinations(template, TWO_LETTER_WORDS_LENGTH)
            || this.containsImpossibleCombinations(template, THREE_LETTER_WORDS_LENGTH)) {
            return [];
        }
        const positions: number[] = [];
        for (let i: number = 0; i < template.length; i++) {
            if (template[i] !== ANY_CHAR) {
                positions.push(i);
            }
        }
        const words: string[] = WORDS[template.length - MIN_WORD_LENGTH].slice();  //creates a copy of the array
        if (positions.length === 0) {
            return ArrayHelper.shuffle(words.splice(0, MAX_WORDS_PER_RESPONSE));
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

        return ArrayHelper.shuffle(validWords).splice(0, MAX_WORDS_PER_RESPONSE);
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
        let definitionIndex: number;
        for (const word of words) {
            try {
                definitionIndex = word.findDefinitionIndex(isEasy);
            } catch (e) {
                console.error(e);
                continue;
            }
            if (word.isValidWithTemplate(criteria) && word.isCommon() === isCommon) {
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
                case TWO_LETTER_WORDS_LENGTH:
                    if (this.invalidDoubles.has(template.substr(currentIndex, TWO_LETTER_WORDS_LENGTH))) {
                        return true;
                    }
                    currentIndex++;
                    break;
                case THREE_LETTER_WORDS_LENGTH:
                    if (template[currentIndex + 1] !== "-" && template[currentIndex + TWO_LETTER_WORDS_LENGTH] !== "-") {
                        if (this.invalidTriples.has(template.substr(currentIndex, THREE_LETTER_WORDS_LENGTH))) {
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
}
