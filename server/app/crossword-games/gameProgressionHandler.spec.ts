import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { GameProgessionHandler } from "./gameProgressionHandler";
import { assert } from "chai";

import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

const words: GridWord[] = [];
const word1: GridWord = new GridWord(0, 0, 0, "computer");
const word2: GridWord = new GridWord(0, 0, 1, "car");
const word3: GridWord = new GridWord(1, 1, 1, "word");

const hostId: string = "hostID";

const gameProgressionHandler: GameProgessionHandler = new GameProgessionHandler();

describe("Game progression handler:", () => {

    words.push(word1);
    words.push(word2);
    words.push(word3);

    const game: GameConfiguration = new GameConfiguration("game0", hostId, "hostUsername", Difficulty.EASY, words);

    it("validated words should not include the words", (done: MochaDone) => {
        assert.equal( gameProgressionHandler.includesWord(word1, game), false);
        assert.equal( gameProgressionHandler.includesWord(word2, game), false);
        assert.equal( gameProgressionHandler.includesWord(word3, game), false);
        done();
    });

    it("should add the words because they are not validated yet", (done: MochaDone) => {

        assert.equal( gameProgressionHandler.isAddValidatedWord(word1, game, hostId), true);
        assert.equal( gameProgressionHandler.isAddValidatedWord(word2, game, hostId), true);

        done();
    });

    it("validated words should now include the words added", (done: MochaDone) => {
        assert.equal( gameProgressionHandler.includesWord(word1, game), true);
        assert.equal( gameProgressionHandler.includesWord(word2, game), true);
        assert.equal( gameProgressionHandler.includesWord(word3, game), false);
        done();
    });
});
