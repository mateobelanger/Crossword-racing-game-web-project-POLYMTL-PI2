import { Word } from "../word";

// change name of class?
export class JsonReader {

    public constructor() {}

    // remettre private
    public readData(words: JSON): Word[] {

        const seperatedWords: Word[] = new Array<Word>();

        for ( let i: number = 0; i < Object.keys(words).length; i++) {
            const word: Word = new Word(words[i].word, words[i].tags, words[i].defs);
            seperatedWords.push(word);
        }

        return seperatedWords;
    }

    public getWordsBasedOnRarity(words: JSON, isCommon: boolean): JSON {

        // const seperatedWords: Word[] = this.readData(words);
        const selectedWords: Word[] = new Array<Word>();

        this.readData(words).forEach(element => {
            if (element.isCommon() === isCommon) {
                selectedWords.push(element);
            }
        });

        return JSON.parse(JSON.stringify(selectedWords));
    }

    public getValidWordsBasedOnDifficulty(words: JSON, isCommon: boolean, isEasy: boolean): JSON {

        // const seperatedWords: Word[] = this.readData(words);
        const selectedWords: Word[] = new Array<Word>();

        this.readData(words).forEach(element => {
            if (element.isCommon() === isCommon && element.hasValidDefinition(isEasy)) {
                selectedWords.push(element);
            }
        });

        return JSON.parse(JSON.stringify(selectedWords));
    }
}
