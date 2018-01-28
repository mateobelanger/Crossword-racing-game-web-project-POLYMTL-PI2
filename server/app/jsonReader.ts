//import { LexicalService } from "./lexicalService";
import { Word } from "./word";
//import {  } from "./words";

export class JsonReader {

    constructor(){}

    private readData(): Word[] {
        const fs = require("fs");
        const data: string = fs.readFileSync("./app/words.json");
        const words: JSON = JSON.parse(data);

/*        let seperatedWords2 : Word[] = new Array<Word>();
        const words2: JSON = JSON.parse(data, function(key, value) { 
            if ( Number(value.tags.toString().substring(2)) > 10 ) 
                seperatedWords2.push(value); 
            return value; })
            
            
        const words2: JSON = JSON.parse.filter(function (entry) {
            return Number(entry.tags.toString().substring(2)) > 10;
        });
*/       


//        var data = require("./app/words.json");

        let seperatedWords : Word[] = new Array<Word>();

        for( let i : number = 0; i < Object.keys(words).length; i++){
            let word : Word = new Word(words[i].word, words[i].tags, words[i].defs);
            seperatedWords.push(word);
        }

        return seperatedWords;
    }

    // meilleur nom?
    public getWordsBasedOnCommon(isCommon : boolean): Word[] {

        let seperatedWords : Word[] = this.readData();
        let searchedWords : Word[] = new Array<Word>();

        // test
        seperatedWords.forEach(element => {
            if(element.isCommon == isCommon){
                searchedWords.push(element);
                console.log(element.name + "   " + element.isCommon + "   " );
            } 
        });

        return seperatedWords;
    }

}
