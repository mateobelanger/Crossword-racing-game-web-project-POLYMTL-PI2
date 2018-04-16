import * as http from "http";
import * as SocketIo from "socket.io";

import { CrosswordGame } from "../../common/crosswordsInterfaces/crosswordGame";
import { Difficulty, SocketMessage } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

import { GameProgessionHandler } from "./crossword-games/gameProgressionHandler";
import { GameLobbiesHandler } from "./crossword-games/gameLobbiesHandler";

enum PlayerType { HOST, GUEST }

// TODO : @injectable()
export class Io {

    private socketServer: SocketIO.Server;

    constructor(server: http.Server) {

        this.socketServer = SocketIo(server);
        this.socketServer.on(SocketMessage.CONNECTION, (socket: SocketIO.Socket) => {
            this.initializeServerGameManager(socket);
            this.initializeServerGameProgression(socket);
            this.initializeServerGameRestarter(socket);
        });
    }

    private initializeServerGameManager(socket: SocketIO.Socket): void {
        socket.on(SocketMessage.CREATE_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            GameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, false);
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.CREATE_SOLO_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            socket.emit(SocketMessage.INITIALIZE_GAME, GameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, true));
        });

        socket.on(SocketMessage.JOIN_GAME, (roomId: string, guestName: string) => {
            if (!GameLobbiesHandler.isAlreadyInAGame(socket.id)) {
                socket.join(roomId);
                const joinedGame: CrosswordGame = GameLobbiesHandler.joinGame(roomId, socket.id, guestName);
                socket.emit(SocketMessage.SENT_GAME_AFTER_JOIN, joinedGame);
                socket.to(joinedGame.hostId).emit(SocketMessage.INITIALIZE_GAME, joinedGame);
                this.broadcastGameLists();
            }
        });

        socket.on(SocketMessage.GET_GAME_LOBBIES, () => {
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.DISCONNECT, () => {
            GameLobbiesHandler.disconnect(socket.id);
            this.broadcastGameLists();
        });
    }

    private initializeServerGameRestarter(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.HOST_RESTART_PENDING, (roomId: string, isGuestReady: boolean, newWords: GridWord[]) => {
            this.hostAskForRestart(roomId, isGuestReady, newWords);
        });
        /// TODO  GAME_RESTART
        socket.on(SocketMessage.GUEST_RESTART_PENDING, (roomId: string, newWords: GridWord[], isHostReady: boolean) => {
            this.guestAskForRestart(roomId, socket, isHostReady);
        });
    }

    private initializeServerGameProgression(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.ADD_VALIDATED_WORD, (word: GridWord, roomId: string) => {
            const game: CrosswordGame = GameLobbiesHandler.getGameById(roomId);
            if (GameProgessionHandler.isAddValidatedWord(word, game, socket.id)) {
                this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
            }
        });

        socket.on(SocketMessage.SELECT_WORD, (selectedWord: GridWord) => {
            socket.to(GameLobbiesHandler.getGameById(socket.id).roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);
        });

        socket.on(SocketMessage.DESELECT_WORD, (word: GridWord) => {
            socket.to(GameLobbiesHandler.getGameById(socket.id).roomId).emit(SocketMessage.REMOTE_DESELECTED_WORD, word);
        });
    }

    private broadcastGameLists(): void {
        this.socketServer.emit(SocketMessage.GAME_LOBBIES, GameLobbiesHandler.pendingGames, GameLobbiesHandler.multiplayerGames);
    }

    private createAndJoinNewRoom(socket: SocketIO.Socket): string {
        const roomId: string = "game" + (GameLobbiesHandler.numberOfGames).toString();
        socket.join(roomId);

        return roomId;
    }

    /// TODO  GAME_RESTART *** Ne devrait pas passer de socket en parametre (théoriquement corrigé)
    private hostAskForRestart(roomId: string, isGuestReady: boolean, newWords: GridWord[]): void {
        let game: CrosswordGame = GameLobbiesHandler.getGameById(roomId);
        // TODO: potentiellement a changer , TRESSS SKETCH
        if (game === undefined) {
            game = GameLobbiesHandler.getGameById(roomId);
        }
        game.restartGame();
        game._words = GameLobbiesHandler.castHttpToGridWord(newWords);
        this.socketServer.in(roomId).emit(SocketMessage.HOST_ASKED_FOR_RESTART, game);

        if (isGuestReady) {
            game.isWaitingForRestart[PlayerType.HOST] = false;
            game.isWaitingForRestart[PlayerType.GUEST] = false;
            this.socketServer.in(roomId).emit(SocketMessage.SENT_GAME_AFTER_JOIN, game);
        }
    }
    /// TODO  GAME_RESTART *** Ne devrait pas passer de socket en parametre
    private guestAskForRestart(roomId: string, socket: SocketIO.Socket, isHostReady: boolean): void {
        const game: CrosswordGame = GameLobbiesHandler.getGameById(roomId);
        socket.to(game.hostId).emit(SocketMessage.GUEST_ASKED_FOR_RESTART, game);
    }

}
