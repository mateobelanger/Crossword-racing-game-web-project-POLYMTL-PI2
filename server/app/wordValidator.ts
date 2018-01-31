//import { LexicalService } from "./lexicalService";
import { Word } from "./word";

export class WordValidator {

    public constructor() {}

    public findValidWords( isDifficult: boolean, words: Word[] ): Word[] {

        let validWords: Word[];

        for (let i: number = 0; i < words.length; i++) {
            console.log(i);
            if (words[i].establishDefinitionIndex(isDifficult) != -1) {
                words[i].removeExampleFromDefinition(); // appel ok ?? ou mettre
                validWords.push(words[i]);
            }
        }

        return validWords;
    }

    // TODO
    // cas ou aucun mot n'est trouve a traiter
    // s'assurer que mot n'est pas deja dans la grille
    // enlever les exemples: "v	bring forth, "The apple tree bore delicious apples this year"",
}
