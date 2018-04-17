import { GameLobbiesHandler } from "./GameLobbiesHandler";
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

describe("Game progression handler, after construction: ", () => {
    it("the number of returned games should be 0", (done: MochaDone) => {
        assert.equal(GameLobbiesHandler.numberOfGames, 0);
        done();
    });

    it("should have no pending nor multiplayer games", (done: MochaDone) => {
        assert.equal(GameLobbiesHandler.multiplayerGames.length, 0);
        assert.equal(GameLobbiesHandler.pendingGames.length, 0);
        done();
    });

    it("should have no players already in a game", (done: MochaDone) => {
        assert.equal(GameLobbiesHandler.isAlreadyInAGame(hostId), false);
        assert.equal(GameLobbiesHandler.isAlreadyInAGame(guestId), false);
        done();
    });

    it("should return no game", (done: MochaDone) => {
        assert.equal(GameLobbiesHandler.getGameById(hostId), undefined);
        done();
    });
});

describe("Game progression handler:", () => {

    words.push(word1);
    words.push(word2);
    words.push(word3);

    let expectedMultiplayerGamesLength: number = 0;
    let expectedPendingGamesLength: number = 0;

    beforeEach(() => {
        expectedMultiplayerGamesLength = 0;
        expectedPendingGamesLength = 0;
        GameLobbiesHandler.disconnect(hostId);
        GameLobbiesHandler.disconnect(guestId);
    });

    it("should have one pending game after creation of a game", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        expectedPendingGamesLength++;

        assert.equal(GameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal(GameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("the number of returned games should be 1", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);

        assert.equal(GameLobbiesHandler.numberOfGames, 1);
        done();
    });

    it("should have one more multiplayer game after a player joined a valid game", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        GameLobbiesHandler.joinGame(roomId, guestId, guestName);

        expectedMultiplayerGamesLength++;

        assert.equal(GameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal(GameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("both players should be considered already in a game", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        GameLobbiesHandler.joinGame(roomId, guestId, guestName);

        assert.equal(GameLobbiesHandler.isAlreadyInAGame(hostId), true);
        assert.equal(GameLobbiesHandler.isAlreadyInAGame(guestId), true);
        done();
    });

    it("should not create a game if a player already in a game tried to create it", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);

        assert.equal(GameLobbiesHandler.pendingGames.length, ++expectedPendingGamesLength);
        done();
    });

    it("should have one less multiplayer game after a player got disconnected", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);
        GameLobbiesHandler.joinGame(roomId, guestId, guestName);

        GameLobbiesHandler.disconnect(guestId);

        assert.equal(GameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
        assert.equal(GameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
        done();
    });

    it("should return the right game game", (done: MochaDone) => {
        GameLobbiesHandler.createGame(roomId, hostId, hostName, Difficulty.EASY, words, false);

        assert.equal(GameLobbiesHandler.getGameById(hostId).roomId, roomId);
        done();
    });

});
