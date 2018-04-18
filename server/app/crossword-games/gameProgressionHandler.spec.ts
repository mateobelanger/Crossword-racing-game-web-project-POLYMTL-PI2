import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { GameProgessionHandler } from "./gameProgressionHandler";
import { assert } from "chai";

import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

const WORD1: GridWord = new GridWord(0, 0, 0, "computer");
const WORD2: GridWord = new GridWord(0, 0, 1, "car");
const WORD3: GridWord = new GridWord(1, 1, 1, "word");

const HOST_ID: string = "hostId";

describe("Game progression handler:", () => {
    const words: GridWord[] = [];
    words.push(WORD1);
    words.push(WORD2);
    words.push(WORD3);

    const game: CrosswordGame = new CrosswordGame("game0", HOST_ID, "hostUsername", Difficulty.EASY, words);

    it("should not include the words because they are not validated yet", (done: MochaDone) => {

        assert.equal( GameProgessionHandler["includesWord"](game, WORD1), false);
        assert.equal( GameProgessionHandler["includesWord"](game, WORD2), false);
        assert.equal( GameProgessionHandler["includesWord"](game, WORD3), false);

        done();
    });

    it("should add the words because they are not validated yet", (done: MochaDone) => {

        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD1, game, HOST_ID), true);
        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD2, game, HOST_ID), true);
        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD3, game, HOST_ID), true);

        done();
    });

    it("should include the words because they are not validated yet", (done: MochaDone) => {

        assert.equal( GameProgessionHandler["includesWord"](game, WORD1), true);
        assert.equal( GameProgessionHandler["includesWord"](game, WORD2), true);
        assert.equal( GameProgessionHandler["includesWord"](game, WORD3), true);

        done();
    });

    it("should not add the words because they are validated ", (done: MochaDone) => {

        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD1, game, HOST_ID), false);
        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD2, game, HOST_ID), false);
        assert.equal( GameProgessionHandler.isAddValidatedWord(WORD3, game, HOST_ID), false);

        done();
    });

});
