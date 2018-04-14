import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty, SocketMessage } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";
import { GameProgessionHandler } from "./crossword-games/gameProgressionHandler";
import { GameLobbiesHandler } from "./crossword-games/gameLobbiesHandler";

// enum GameType { SOLO, MULTIPLAYER, PENDING }

enum PlayerType { HOST, GUEST }

// TODO : @injectable()
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

    // tslint:disable-next-line:max-func-body-length
    private initializeServerGameManager(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.CREATE_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            this.gameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, false);
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.CREATE_SOLO_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            const newGame: GameConfiguration = this.gameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, true);
            socket.emit(SocketMessage.INITIALIZE_GAME, newGame);
        });

        socket.on(SocketMessage.GET_GAME_LOBBIES, () => {
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.JOIN_GAME, (roomId: string, guestName: string) => {
            if (!this.gameLobbiesHandler.isAlreadyInAGame(socket.id)) {
                socket.join(roomId);
                const joinedGame: GameConfiguration = this.gameLobbiesHandler.joinGame(roomId, socket.id, guestName);

                socket.emit(SocketMessage.GRID_FROM_JOIN, joinedGame);
                socket.to(joinedGame.hostId).emit(SocketMessage.INITIALIZE_GAME, joinedGame);
                this.broadcastGameLists();
            }

        });

        /// TODO  GAME_RESTART
        socket.on(SocketMessage.HOST_RESTART_PENDING, (roomId: string, isGuestReady: boolean, newWords: GridWord[]) => {
            this.hostAskForRestart(roomId, socket, isGuestReady, newWords);
        });
        /// TODO  GAME_RESTART
        socket.on(SocketMessage.GUEST_RESTART_PENDING, (roomId: string, newWords: GridWord[], isHostReady: boolean) => {
            this.guestAskForRestart(roomId, socket, isHostReady);
        });

        socket.on(SocketMessage.DISCONNECT, () => {
            this.gameLobbiesHandler.disconnect(socket.id);
            this.broadcastGameLists();
        });

    }

    private initializeServerGameProgression(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.ADD_VALIDATED_WORD, (word: GridWord, roomId: string) => {
            const game: GameConfiguration = this.gameLobbiesHandler.getGameById(roomId);
            if (this.gameProgressionHandler.isAddValidatedWord(word, game, socket.id)) {
                this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
            }
        });

        socket.on(SocketMessage.SELECT_WORD, (selectedWord: GridWord) => {
            // this.gameProgressionHandler.selectWord(this.gameLobbiesHandler.getGameById(socket.id), socket, selectedWord);
            socket.to(this.gameLobbiesHandler.getGameById(socket.id).roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);
        });

        socket.on(SocketMessage.DESELECT_WORD, (word: GridWord) => {
            // this.gameProgressionHandler.deselectWord(this.gameLobbiesHandler.getGameById(socket.id), socket, word);
            socket.to(this.gameLobbiesHandler.getGameById(socket.id).roomId).emit(SocketMessage.REMOTE_DESELECTED_WORD, word);
        });
    }

    private broadcastGameLists(): void {
        this.socketServer.emit("gameLobbies", this.gameLobbiesHandler.pendingGames, this.gameLobbiesHandler.multiplayerGames);
    }

    private createAndJoinNewRoom(socket: SocketIO.Socket): string {
        const roomId: string = "game" + (this.gameLobbiesHandler.newRoomIdNumber).toString();
        socket.join(roomId);

        return roomId;
    }

    /// TODO  GAME_RESTART *** Ne devrait pas passer de socket en parametre
    public hostAskForRestart(roomId: string, socket: SocketIO.Socket, isGuestReady: boolean, newWords: GridWord[]): void {
        let game: GameConfiguration = this.gameLobbiesHandler.getGameById(roomId);
        // TODO: potentiellement a changer , TRESSS SKETCH
        if (game === undefined) {
            game = this.gameLobbiesHandler.getGameById(roomId);
        }
        game.restartGame();
        game._words = this.gameLobbiesHandler.castHttpToGridWord(newWords);
        this.socketServer.in(roomId).emit(SocketMessage.HOST_ASK_FOR_RESTART, game);
        //socket.to(game.roomId).emit(SocketMessage.HOST_ASK_FOR_RESTART, game);
        //socket.to(game.).emit(SocketMessage.HOST_ASK_FOR_RESTART, game);

        if (isGuestReady) {
            game.isWaitingForRestart[PlayerType.HOST] = false;
            game.isWaitingForRestart[PlayerType.GUEST] = false;
            this.socketServer.in(roomId).emit(SocketMessage.GRID_FROM_JOIN, game);
        }
    }
    /// TODO  GAME_RESTART *** Ne devrait pas passer de socket en parametre
    public guestAskForRestart(roomId: string, socket: SocketIO.Socket, isHostReady: boolean): void {
        const game: GameConfiguration = this.gameLobbiesHandler.getGameById(roomId);
        socket.to(game.hostId).emit(SocketMessage.GUEST_ASK_FOR_RESTART, game);
    }

}
