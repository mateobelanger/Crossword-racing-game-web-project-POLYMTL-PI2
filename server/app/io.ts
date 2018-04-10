import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty, SocketMessage } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";
import { GameProgessionHandler } from "./crossword-games/gameProgressionHandler";
import { GameLobbiesHandler } from "./crossword-games/gameLobbiesHandler";

// enum GameType { SOLO, MULTIPLAYER, PENDING }

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    private gameProgressionHandler: GameProgessionHandler;
    private gameLobbiesHandler: GameLobbiesHandler;

    constructor(server: http.Server) {

        this.gameLobbiesHandler = new GameLobbiesHandler();
        this.gameProgressionHandler = new GameProgessionHandler();

        this.socketServer = SocketIo(server);
        this.socketServer.on(SocketMessage.CONNECTION, (socket: SocketIO.Socket) => {
            this.initializeServerGameManager(socket);
            this.initializeServerGameProgression(socket);
        });
    }

    private initializeServerGameManager(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.CREATE_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            this.gameLobbiesHandler.createGame(socket, username, difficulty, words, false);
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.CREATE_SOLO_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            this.gameLobbiesHandler.createGame(socket, username, difficulty, words, true);
        });

        socket.on(SocketMessage.GET_GAME_LOBBIES, () => {
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.JOIN_GAME, (roomId: string, guestName: string) => {
            this.gameLobbiesHandler.joinGame(socket, roomId, guestName);
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.DISCONNECT, () => {
            this.gameLobbiesHandler.disconnect(socket);
            this.broadcastGameLists();
        });

    }

    private initializeServerGameProgression(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.ADD_VALIDATED_WORD, (word: GridWord, roomId: string) => {
            const game: GameConfiguration = this.gameLobbiesHandler.getGameById(roomId);
            if (this.gameProgressionHandler.isAddValidatedWord(word, game, socket)) {
                this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
            }
        });

        socket.on(SocketMessage.SELECT_WORD, (selectedWord: GridWord) => {
            this.gameProgressionHandler.selectWord(this.gameLobbiesHandler.getGameById(socket.id), socket, selectedWord);
        });

        socket.on(SocketMessage.DESELECT_WORD, (word: GridWord) => {
            this.gameProgressionHandler.deselectWord(this.gameLobbiesHandler.getGameById(socket.id), socket, word);
        });
    }

    private broadcastGameLists(): void {
        this.socketServer.emit("gameLobbies", this.gameLobbiesHandler._pendingGames, this.gameLobbiesHandler._multiplayerGames);
    }

}
