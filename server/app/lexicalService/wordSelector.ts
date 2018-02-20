import { DictionaryEntry } from "../dictionaryEntry";

export class WordSelector {

    private static readData(words: JSON): DictionaryEntry[] {
        const seperatedWords: DictionaryEntry[] = new Array<DictionaryEntry>();

        for ( let i: number = 0; i < Object.keys(words).length; i++) {
            const word: DictionaryEntry = new DictionaryEntry(words[i].word, words[i].tags, words[i].defs);
            seperatedWords.push(word);
        }

        return seperatedWords;
    }

    public static getWordsBasedOnRarity(words: JSON, isCommon: boolean): JSON {

        const selectedWords: DictionaryEntry[] = new Array<DictionaryEntry>();

        this.readData(words).forEach( (element: DictionaryEntry) => {
            if (element.isCommon() === isCommon) {
                selectedWords.push(element);
            }
        });

        return JSON.parse(JSON.stringify(selectedWords));
    }

    public static getValidWordsBasedOnDifficulty(words: JSON, criteria: string,  isCommon: boolean, isEasy: boolean): JSON {

        const selectedWords: DictionaryEntry[] = new Array<DictionaryEntry>();

        this.readData(words).forEach( (element: DictionaryEntry) => {
            if (element.isValidWithTemplate(criteria) && element.isCommon() === isCommon && element.hasValidDefinition(isEasy)) {
                selectedWords.push(element);
            }
        });

        return JSON.parse(JSON.stringify(selectedWords));
    }

    // used when a word is directly searched
    public static confirmWordBasedOnDifficulty(words: JSON, isCommon: boolean, isEasy: boolean, word: string): JSON {

        const selectedWords: DictionaryEntry[] = new Array<DictionaryEntry>();
        if(Object.keys(words).length === 0) {
            return JSON.parse(JSON.stringify(selectedWords));
        }
        const element: DictionaryEntry = this.readData(words)[0];
        if (element.isValidWithTemplate(word) && element.isCommon() === isCommon && element.hasValidDefinition(isEasy)) {
                selectedWords.push(element );
        }

        return JSON.parse(JSON.stringify(selectedWords));
    }

}
