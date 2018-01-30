//import { LexicalService } from "./lexicalService";
import { Word } from "./word";

export class WordValidator {

    constructor(){}

    public findValidWord( isDifficult : boolean, words : Word[] ) : Word {

        let word : Word;

        for( let i : number = 0; i < words.length; i++){
            if(words[i].establishDefinitionIndex(isDifficult) != -1){
                word = words[i];
                break;
            } 
        }

        console.log(word);

        return word;
    }
    // TODO
    // cas ou aucun mot n'est trouve a traiter
    // s'assurer que mot n'est pas deja dans la grille
}
