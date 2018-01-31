import { Word } from "../word";

// change name of class?
export class JsonReader {

    constructor() {}

    // remettre private
    public readData(words: JSON): Word[] {
        // const fs = require("fs");
        // const data: string = fs.readFileSync("./app/words.json");
        // const words: JSON = JSON.parse(data);

        const seperatedWords: Word[] = new Array<Word>();

        for ( let i: number = 0; i < Object.keys(words).length; i++) {
            const word: Word = new Word(words[i].word, words[i].tags, words[i].defs);
            seperatedWords.push(word);
        }

        return seperatedWords;
    }

    // test : into n'est pas la, bind n'est pas la
    public getValidWordsBasedOnRarity(words: JSON, isCommon: boolean): JSON {
        
        // const seperatedWords: Word[] = this.readData(words);
        const selectedWords: Word[] = new Array<Word>();

        this.readData(words).forEach(element => {
            if (element.isCommon() === isCommon && element.hasDefinitions()) {
                selectedWords.push(element);
            }
        });

        return JSON.parse(JSON.stringify(selectedWords));
    }

}

// todo test getWords