import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { GameProgessionHandler } from "./gameProgressionHandler";
import { assert } from "chai";

import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

const words: GridWord[] = [];
const word1: GridWord = new GridWord(0, 0, 0, "computer");
const word2: GridWord = new GridWord(0, 0, 1, "car");
const word3: GridWord = new GridWord(1, 1, 1, "word");

const hostId: string = "hostId";

// const gameProgressionHandler: GameProgessionHandler = new GameProgessionHandler();

describe("Game progression handler:", () => {

    words.push(word1);
    words.push(word2);
    words.push(word3);

    const game: CrosswordGame = new CrosswordGame("game0", hostId, "hostUsername", Difficulty.EASY, words);

    // it("validated words should not include the words", (done: MochaDone) => {
    //     assert.equal( GameProgessionHandler.includesWord(word1, game), false);
    //     assert.equal( GameProgessionHandler.includesWord(word2, game), false);
    //     assert.equal( GameProgessionHandler.includesWord(word3, game), false);
    //     done();
    // });

    it("should add the words because they are not validated yet", (done: MochaDone) => {

        assert.equal( GameProgessionHandler.isAddValidatedWord(word1, game, hostId), true);
        assert.equal( GameProgessionHandler.isAddValidatedWord(word2, game, hostId), true);
        assert.equal( GameProgessionHandler.isAddValidatedWord(word2, game, hostId), true);

        done();
    });

    it("should not add the words because they are validated ", (done: MochaDone) => {

        assert.equal( GameProgessionHandler.isAddValidatedWord(word1, game, hostId), false);
        assert.equal( GameProgessionHandler.isAddValidatedWord(word2, game, hostId), false);
        assert.equal( GameProgessionHandler.isAddValidatedWord(word2, game, hostId), false);

        done();
    });

    // it("validated words should now include the words added", (done: MochaDone) => {
    //     assert.equal( GameProgessionHandler.includesWord(word1, game), true);
    //     assert.equal( GameProgessionHandler.includesWord(word2, game), true);
    //     assert.equal( GameProgessionHandler.includesWord(word3, game), false);
    //     done();
    // });
});
