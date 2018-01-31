//import { LexicalService } from "./lexicalService";
import { Word } from "./word";

export class WordValidator {

    public constructor() {}

    public findValidWord( isDifficult: boolean, words: Word[] ): Word {

        let word: Word;

        for (let i: number = 0; i < words.length; i++) {
            console.log(i);
            if (words[i].establishDefinitionIndex(isDifficult) != -1) {
                words[i].removeExempleFromDefinition(); // appel ok ?? ou mettre
                word = words[i];
                break;
            }
        }

        return word;
    }

    // TODO
    // cas ou aucun mot n'est trouve a traiter
    // s'assurer que mot n'est pas deja dans la grille
    // enlever les exemples: "v	bring forth, "The apple tree bore delicious apples this year"",
}
