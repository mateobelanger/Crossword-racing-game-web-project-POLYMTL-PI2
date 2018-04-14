// import * as SocketIo from "socket.io";
// import { GameLobbiesHandler } from "./gameLobbiesHandler";
// import { assert } from "chai";

// import { Difficulty } from "../../../common/constants";
// import { GridWord } from "../../../common/crosswordsInterfaces/word";

// const words: GridWord[] = [];
// const word1: GridWord = new GridWord(0, 0, 0, "computer");
// const word2: GridWord = new GridWord(0, 0, 1, "car");
// const word3: GridWord = new GridWord(1, 1, 1, "word");

// const socket1: SocketIO.Socket;
// const socket2: SocketIO.Socket;

// const gameLobbiesHandler: GameLobbiesHandler = new GameLobbiesHandler();

// describe("Game progression handler:", () => {

//     words.push(word1);
//     words.push(word2);
//     words.push(word3);

//     let expectedMultiplayerGamesLength: number = 0;
//     let expectedPendingGamesLength: number = 0;

//     it("should have no pending nor multiplayer games after construction", (done: MochaDone) => {
//         assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
//         assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
//         done();
//     });

//     it("should have one pending game after creation of a game", (done: MochaDone) => {
//         gameLobbiesHandler.createGame(socket1, "bob", Difficulty.EASY, words, false);
//         expectedPendingGamesLength = gameLobbiesHandler.pendingGames.length + 1;

//         assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
//         assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
//         done();
//     });

//     it("should have one more multiplayer game after a player joined a valid game", (done: MochaDone) => {
//         gameLobbiesHandler.joinGame(socket2, socket1.id, "barbara");
//         expectedMultiplayerGamesLength = gameLobbiesHandler.multiplayerGames.length + 1;
//         expectedPendingGamesLength = gameLobbiesHandler.pendingGames.length - 1;

//         assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
//         assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
//         done();
//     });

//     it("should not create a game if a player already in a game tried to create it", (done: MochaDone) => {
//         gameLobbiesHandler.createGame(socket2, "barbara", Difficulty.EASY, words, false);

//         assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
//         assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
//         done();
//     });

//     it("should have one less multiplayer game after a player got disconnected", (done: MochaDone) => {
//         gameLobbiesHandler.disconnect(socket2);
//         expectedMultiplayerGamesLength = gameLobbiesHandler.multiplayerGames.length - 1;

//         assert.equal( gameLobbiesHandler.multiplayerGames.length, expectedMultiplayerGamesLength);
//         assert.equal( gameLobbiesHandler.pendingGames.length, expectedPendingGamesLength);
//         done();
//     });

// });
