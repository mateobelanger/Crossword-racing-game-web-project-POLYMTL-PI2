//import { LexicalService } from "./lexicalService";
import { Word } from "./word";
//import {  } from "./words";

export class JsonReader {

    constructor(){}

    readData(){
        var fs = require("fs");
        var data = fs.readFileSync("./app/words.json");
        var words1 = JSON.parse(data);
        console.log(words1);

//        var data = require("./app/words.json");

/*
        let words : Word[] = new Array<Word>();

        for( let i : number = 0; i < Object.keys(data).length; i++){
            let word : Word = new Word(data.words[i].word, data.words[i].tags[0], data.words[i].defs);
            words.push(word);
        }


        data.words.forEach(element => {
            let word : Word = new Word(element.word, element.tags.f, element.defs);
            words.push(word);
        });

        words.forEach(element => {
            console.log(element.name + "   " + element.isCommon.toString() + "   " +  element.name + "/n");
        });
*/
    }

    




}
