import { GameLobbiesHandler } from "./gameLobbiesHandler";
import { assert } from "chai";

import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

const words: GridWord[] = [];
const word1: GridWord = new GridWord(0, 0, 0, "computer");
const word2: GridWord = new GridWord(0, 0, 1, "car");
const word3: GridWord = new GridWord(1, 1, 1, "word");

const hostId: string = "hostId";
const guestId: string = "guestId";
const roomId: string = "game0";

const hostName: string = "bob";
const guestName: string = "barb";

const gameLobbiesHandler: GameLobbiesHandler = new GameLobbiesHandler();

describe("Game progression handler:", () => {

    words.push(word1);
    words.push(word2);
    words.push(word3);

    let expectedMultiplayerGamesLength: number = 0;
    let expectedPendingGamesLength: number = 0;

    it("should have no pending nor multiplayer games after construction", (done: MochaDone) => {
        assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("should have one pending game after creation of a game", (done: MochaDone) => {
        gameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        expectedPendingGamesLength++;

        assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("should be considered already in a game", (done: MochaDone) => {
        assert.equal(gameLobbiesHandler.isAlreadyInAGame(hostId), true);
        assert.equal(gameLobbiesHandler.isAlreadyInAGame(guestId), false);
        done();
    });

    it("should have one more multiplayer game after a player joined a valid game", (done: MochaDone) => {
        gameLobbiesHandler.joinGame(roomId, guestId, guestName);
        expectedMultiplayerGamesLength++;
        expectedPendingGamesLength--;

        assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("should be considered already in a game", (done: MochaDone) => {
        assert.equal(gameLobbiesHandler.isAlreadyInAGame(hostId), true);
        assert.equal(gameLobbiesHandler.isAlreadyInAGame(guestId), true);
        done();
    });

    it("should not create a game if a player already in a game tried to create it", (done: MochaDone) => {
        gameLobbiesHandler.createGame(guestId, roomId, "barbara", Difficulty.EASY, words, false);

        assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("should have one less multiplayer game after a player got disconnected", (done: MochaDone) => {
        gameLobbiesHandler.disconnect(guestId);
        expectedMultiplayerGamesLength--;

        assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

});
