import { DatamuseResponse } from "./IdatamuseResponse";
import { Word } from "../../../common/crosswordsInterfaces/word"

export class WordSelector {

    /*private static readData(datamuseResponse: DatamuseResponse): Word {
        let word: Word;

        word.row = NO_VALUE;
        word.column = NO_VALUE;
        word.value = datamuseResponse.word;

        return seperatedWords;
    }*/

    public static getWordsBasedOnRarity(words: Array<DatamuseResponse>, isCommon: boolean): Array<DatamuseResponse> {

        const selectedWords: Array<DatamuseResponse> = new Array<DatamuseResponse>();

        words.forEach( (element: DatamuseResponse) => {
            if (element.isCommon() === isCommon) {
                selectedWords.push(element);
            }
        });

        return selectedWords;
    }

    public static getValidWordsBasedOnDifficulty(words: Array<DatamuseResponse>, criteria: string,  isCommon: boolean, isEasy: boolean): Array<Word> {
        const selectedWords: Array<Word> = new Array<Word>();
        for(let i: number = 0; i < words.length; i++) {
            let definitionIndex: number = words[i].findDefinitionIndex(isEasy);
            if (words[i].isValidWithTemplate(criteria) && words[i].isCommon() === isCommon && definitionIndex !== -1) {
                selectedWords.push(this.datamuseResponseToWord(words[i], definitionIndex));
            }
        }

        return selectedWords;
    }

    // used when a word is directly searched
    public static confirmWordBasedOnDifficulty(words: Array<DatamuseResponse>, isCommon: boolean, isEasy: boolean, word: string): Array<Word> {

        const selectedWords: Array<Word> = new Array<Word>();
        if(Object.keys(words).length === 0) {
            return selectedWords;
        }
        const element: DatamuseResponse = words[0];
        let definitionIndex: number = element.findDefinitionIndex(isEasy);
        if (element.isValidWithTemplate(word) && element.isCommon() === isCommon &&
            definitionIndex !== -1) {
                selectedWords.push(this.datamuseResponseToWord(element, definitionIndex));
        }

        return selectedWords;
    }

    private static datamuseResponseToWord ( datamuseResponse: DatamuseResponse, definitionIndex: number): Word {
        return new Word(datamuseResponse.word, datamuseResponse.defs[definitionIndex]);
    }

}
