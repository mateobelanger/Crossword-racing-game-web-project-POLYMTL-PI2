// import * as http from "http";
// import { injectable } from "inversify";
// import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty, SocketMessage } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

enum GameType { SOLO, MULTIPLAYER, PENDING }

export class GameLobbiesHandler {

    public _soloGames: GameConfiguration[] = [];
    public _multiplayerGames: GameConfiguration[] = [];
    public _pendingGames: GameConfiguration[] = [];

    constructor() {
        this._soloGames = [];
        this._multiplayerGames = [];
        this._pendingGames = [];
    }

    public createGame(socket: SocketIO.Socket, username: string, difficulty: Difficulty, words: GridWord[], isSolo: boolean): void {
        const roomId: string = "game" + (this._soloGames.length + this._multiplayerGames.length + this._pendingGames.length).toString();
        socket.join(roomId);
        if (!this.isAlreadyInAGame(socket.id)) {
            if (isSolo) {
                this.createSoloGame(socket, roomId, username, difficulty, words);
            } else {
                this.createPendingGame(socket, roomId, username, difficulty, words);
            }
        }
    }

    private createSoloGame(socket: SocketIO.Socket, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        const newGame: GameConfiguration =
            new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words));
        this._soloGames.push(newGame);
        socket.emit(SocketMessage.INITIALIZE_GAME, newGame);
    }

    private createPendingGame(socket: SocketIO.Socket, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        this._pendingGames.push(new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words)));
        console.log(username);
    }

    public joinGame(socket: SocketIO.Socket, roomId: string, guestName: string): void {
        if (!this.isAlreadyInAGame(socket.id)) {
            socket.join(roomId);
            this._multiplayerGames.push(this.getGameById(roomId));
            this.deleteGameWithId(this._pendingGames, roomId);
            const joinedGame: GameConfiguration = this.getGameById(roomId);
            joinedGame.updateGuestInformation(socket.id, guestName);
            socket.emit(SocketMessage.GRID_FROM_JOIN, joinedGame);
            socket.to(joinedGame.hostId).emit(SocketMessage.INITIALIZE_GAME, joinedGame); // quel ID ?????????? room id serait ok
        }
    }

    public disconnect(socket: SocketIO.Socket): void {
        if (this.isAlreadyInAGame(socket.id)) {
            const gameType: GameType = this.getGameType(socket.id);
            const game: GameConfiguration = this.getGameById(socket.id);

            switch (gameType) {
                case GameType.SOLO:
                case GameType.PENDING:
                    this.deleteGameById(game.roomId);
                    break;
                case GameType.MULTIPLAYER:
                default:
                    if (game.isHost(socket.id)) {
                        game.hostId = game.guestId;
                    }
                    game.guestId = null;
                    // this.socketServer.to(game.hostId).emit(SocketMessage.DISCONNECTED);

                    this._soloGames.push(game);
                    this.deleteGameWithId(this._multiplayerGames, socket.id);
            }

        }
        console.log(this._soloGames.length);
        console.log(this._pendingGames.length);
        console.log(this._multiplayerGames.length);
    }

    public getGameById(id: string): GameConfiguration {
        const gameType: GameType = this.getGameType(id);
        const games: GameConfiguration[] = this.getGameTypeList(gameType);

        return games.find((game: GameConfiguration) => game.isInGame(id));
    }

    private getGameTypeList(gameType: GameType): GameConfiguration[] {
        switch (gameType) {
            case GameType.SOLO:
                return this._soloGames;
            case GameType.PENDING:
                return this._pendingGames;
            default:
                return this._multiplayerGames;
        }
    }

    public deleteGameById(id: string): void {
        const gameType: GameType = this.getGameType(id);
        const games: GameConfiguration[] = this.getGameTypeList(gameType);

        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    public deleteGameWithId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    public isAlreadyInAGame(id: string): boolean {
        let isInAGame: boolean = false;
        this._soloGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._multiplayerGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._pendingGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });

        return isInAGame;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    public getGameType(id: string): GameType {
        if (this._soloGames.find((game: GameConfiguration) => game.isInGame(id)) !== undefined) {
            return GameType.SOLO;
        } else if (this._multiplayerGames.find((game: GameConfiguration) => game.isInGame(id)) !== undefined) {
            return GameType.MULTIPLAYER;
        } else {
            return GameType.PENDING;
        }
    }

}
