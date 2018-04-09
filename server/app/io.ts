import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty, SocketMessage } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

enum GameType { SOLO, WAITING, ONGOING }

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    private _soloGames: GameConfiguration[] = [];
    private _ongoingGames: GameConfiguration[] = [];
    private _waitingGames: GameConfiguration[] = [];

    constructor(server: http.Server) {
        this.socketServer = SocketIo(server);
        this.socketServer.on(SocketMessage.CONNECTION, (socket: SocketIO.Socket) => {
            this.initializeServerGameManager(socket);
            this.initializeServerGameProgression(socket);
        });
    }

    private initializeServerGameManager(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.CREATE_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            this.createGame(socket, username, difficulty, words, false);
        });

        socket.on(SocketMessage.CREATE_SOLO_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            this.createGame(socket, username, difficulty, words, true);
        });

        socket.on(SocketMessage.GET_GAME_LOBBIES, () => {
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.JOIN_GAME, (roomId: string, guestName: string) => {
            this.joinGame(socket, roomId, guestName);
        });

        socket.on(SocketMessage.DISCONNECT, () => {
            this.disconnect(socket);
        });

    }

    private initializeServerGameProgression(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.ADD_VALIDATED_WORD, (word: GridWord, roomId: string) => {
            this.addValidatedWord(socket, word, roomId);
        });

        socket.on(SocketMessage.SELECT_WORD, (selectedWord: GridWord) => {
            this.selectWord(socket, selectedWord);
        });
    }

    private createGame(socket: SocketIO.Socket, username: string, difficulty: Difficulty, words: GridWord[], isSolo: boolean): void {
        const roomId: string = "game" + (this._soloGames.length + this._ongoingGames.length + this._waitingGames.length).toString();
        socket.join(roomId);
        if (!this.isAlreadyInAGame(socket.id)) {
            if (isSolo) {
                this.createSoloGame(socket, roomId, username, difficulty, words);
            } else {
                this.createWaitingGame(socket, roomId, username, difficulty, words);
            }
        }
    }

    private createSoloGame(socket: SocketIO.Socket, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
            const newGame: GameConfiguration =
                new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words));
            this._soloGames.push(newGame);
            socket.emit(SocketMessage.INITIALIZE_GAME, newGame);
    }

    private createWaitingGame(socket: SocketIO.Socket, roomId: string,
                              username: string, difficulty: Difficulty, words: GridWord[]): void {
        this._waitingGames.push(new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words)));
        socket.broadcast.emit(SocketMessage.GAME_LOBBIES, this._waitingGames, this._ongoingGames);
    }

    private joinGame(socket: SocketIO.Socket, roomId: string, guestName: string): void {
        if (!this.isAlreadyInAGame(socket.id)) {
                socket.join(roomId);
                this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId));
                this.deleteGameByRoomId(this._waitingGames, roomId);
                const joinedGame: GameConfiguration = this.getGameByRoomId(this._ongoingGames, roomId);
                joinedGame.updateGuestInformation(socket.id, guestName);

                socket.emit(SocketMessage.GRID_FROM_JOIN, joinedGame);
                socket.to(joinedGame.hostId).emit(SocketMessage.INITIALIZE_GAME, joinedGame); // quel ID ?????????? room id serait ok

                this.broadcastGameLists();
        }
    }

    private addValidatedWord(socket: SocketIO.Socket, word: GridWord, roomId: string): void {
        const gameType: GameType = this.getGameType(socket.id);
        if (gameType === GameType.ONGOING) {
            this.addValidatedWordOngoing(word, roomId, socket);
        } else if (gameType === GameType.SOLO) {
            this.addValidatedWordSolo(word, roomId, socket);
        }
    }

    private disconnect(socket: SocketIO.Socket): void {
        if (this.isAlreadyInAGame(socket.id)) {
            const gameType: GameType = this.getGameType(socket.id);
            const game: GameConfiguration = this.getGameBySocketId(gameType, socket.id);

            switch (gameType) {
                case GameType.SOLO:
                    this.deleteGameByRoomId(this._soloGames, game.roomId);
                    break;
                case GameType.WAITING:
                    this.deleteGameBySocketId(this._waitingGames, game.roomId);
                    break;
                case GameType.ONGOING:
                default:
                    if (game.isHost(socket.id)) {
                        game.hostId = game.guestId;
                    }
                    game.guestId = null;
                    this.socketServer.to(game.hostId).emit(SocketMessage.DISCONNECTED);

                    this._soloGames.push(game);
                    this.deleteGameBySocketId(this._ongoingGames, socket.id);
            }

        }
        this.broadcastGameLists();
        console.log(this._soloGames.length);
        console.log(this._waitingGames.length);
        console.log(this._ongoingGames.length);
    }

    private selectWord(socket: SocketIO.Socket, selectedWord: GridWord): void {
        const gameType: GameType = this.getGameType(socket.id);
        const game: GameConfiguration = this.getGameBySocketId(gameType, socket.id);

        socket.to(game.roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);

    }

    private broadcastGameLists(): void {
        this.socketServer.emit("gameLobbies", this._waitingGames, this._ongoingGames);
    }

    private getGameBySocketId(gameType: GameType, id: string): GameConfiguration {
        let games: GameConfiguration[];
        switch (gameType) {
            case GameType.SOLO:
                games = this._soloGames;
                break;
            case GameType.WAITING:
                games = this._waitingGames;
                break;
            default:
                games = this._ongoingGames;
        }

        return games.find((game: GameConfiguration) => game.isInGame(id));
    }

    private getGameByRoomId(games: GameConfiguration[], roomId: string): GameConfiguration {
        return games.find((game: GameConfiguration) => game.roomId === roomId);
    }

    // ordre des parametres ?????????????????????????
    private deleteGameByRoomId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.roomId === id));
    }

    private deleteGameBySocketId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    private isAlreadyInAGame(id: string): boolean {
        let isInAGame: boolean = false;
        this._soloGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._ongoingGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._waitingGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });

        return isInAGame;
    }

    private addValidatedWordOngoing(word: GridWord, roomId: string, socket: SocketIO.Socket): void {
        if (!this.includesWord(word, this.getGameByRoomId(this._ongoingGames, roomId))) {
            if (socket.id === this.getGameByRoomId(this._ongoingGames, roomId).hostId) {
                this.getGameByRoomId(this._ongoingGames, roomId).hostValidatedWords.push(word);
            } else {
                this.getGameByRoomId(this._ongoingGames, roomId).guestValidatedwords.push(word);
            }
            this.socketServer.in(roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, this.getGameByRoomId  (this._ongoingGames, roomId));
        }
    }

    private addValidatedWordSolo(word: GridWord, roomId: string, socket: SocketIO.Socket): void {
        if (!this.includesWord(word, this.getGameByRoomId(this._soloGames, roomId))) {
            if (socket.id === this.getGameByRoomId(this._soloGames, roomId).hostId) {
                this.getGameByRoomId(this._soloGames, roomId).hostValidatedWords.push(word);
            } else {
                this.getGameByRoomId(this._soloGames, roomId).guestValidatedwords.push(word);
            }
            this.socketServer.in(roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, this.getGameByRoomId  (this._soloGames, roomId));
        }
    }

    private includesWord(wordToFind: GridWord, game: GameConfiguration): boolean {
        for (const word of game.hostValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }
        for (const word of game.guestValidatedwords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }

        return false;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    private getGameType(socketId: string): GameType {
        if (this._soloGames.find((game: GameConfiguration) => game.isInGame(socketId)) !== undefined) {
            return GameType.SOLO;
        } else if (this._ongoingGames.find((game: GameConfiguration) => game.isInGame(socketId)) !== undefined) {
            return GameType.ONGOING;
        } else {
            return GameType.WAITING;
        }
    }
}
