//import { LexicalService } from "./lexicalService";
import { Word } from "./word";
//import {  } from "./words";

export class JsonReader {

    constructor(){}

    public readData(): void {
        const fs = require("fs");
        const data: string = fs.readFileSync("./app/words.json");
        const words: JSON = JSON.parse(data);
        console.log(words[0].word + words[0].tags);


        

//        var data = require("./app/words.json");

        let separatedWords : Word[] = new Array<Word>();

        for( let i : number = 0; i < Object.keys(words).length; i++){
            let word : Word = new Word(words[i].word, words[i].tags, words[i].defs);
            separatedWords.push(word);
        }


        // test
        separatedWords.forEach(element => {
            console.log(element.name + "   " + element.isCommon.toString() + "   " );
        });

    }

}
