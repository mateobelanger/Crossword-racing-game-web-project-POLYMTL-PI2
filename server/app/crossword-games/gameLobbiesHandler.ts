import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty, SocketMessage } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

enum GameType { SOLO, MULTIPLAYER, PENDING }

export class GameLobbiesHandler {

    private _soloGames: GameConfiguration[];
    private _multiplayerGames: GameConfiguration[];
    private _pendingGames: GameConfiguration[];

    constructor() {
        this._soloGames = [];
        this._multiplayerGames = [];
        this._pendingGames = [];
    }

    public get multiplayerGames(): GameConfiguration[] {
        return this._multiplayerGames;
    }

    public get pendingGames(): GameConfiguration[] {
        return this._pendingGames;
    }

    public createGame(socket: SocketIO.Socket, username: string, difficulty: Difficulty, words: GridWord[], isSolo: boolean): void {
        const roomId: string = "game" + (this._soloGames.length + this._multiplayerGames.length + this._pendingGames.length).toString();
        socket.join(roomId);
        if (!this.isAlreadyInAGame(socket.id)) {
            if (isSolo) {
                this.createSoloGame(socket, roomId, username, difficulty, words);
            } else {
                this._pendingGames.push(new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words)));
            }
        }
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

    public disconnect(socketId: string): void {
        if (this.isAlreadyInAGame(socketId)) {
            const gameType: GameType = this.getGameType(socketId);
            const game: GameConfiguration = this.getGameById(socketId);

            switch (gameType) {
                case GameType.SOLO:
                case GameType.PENDING:
                    this.deleteGameById(game.roomId);
                    break;
                case GameType.MULTIPLAYER:
                default:
                    if (game.isHost(socketId)) {
                        game.hostId = game.guestId;
                    }
                    game.guestId = null;
                    // this.socketServer.to(game.hostId).emit(SocketMessage.DISCONNECTED);

                    this._soloGames.push(game);
                    this.deleteGameWithId(this._multiplayerGames, socketId);
            }

        }
    }

    public getGameById(id: string): GameConfiguration {
        const gameType: GameType = this.getGameType(id);
        const games: GameConfiguration[] = this.getGameTypeList(gameType);

        return games.find((game: GameConfiguration) => game.isInGame(id));
    }

    private deleteGameById(id: string): void {
        const gameType: GameType = this.getGameType(id);
        const games: GameConfiguration[] = this.getGameTypeList(gameType);

        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    private deleteGameWithId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    private getGameType(id: string): GameType {
        if (this._soloGames.find((game: GameConfiguration) => game.isInGame(id)) !== undefined) {
            return GameType.SOLO;
        } else if (this._multiplayerGames.find((game: GameConfiguration) => game.isInGame(id)) !== undefined) {
            return GameType.MULTIPLAYER;
        } else {
            return GameType.PENDING;
        }
    }

    private createSoloGame(socket: SocketIO.Socket, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        const newGame: GameConfiguration =
            new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words));
        this._soloGames.push(newGame);
        socket.emit(SocketMessage.INITIALIZE_GAME, newGame);
    }

    private isAlreadyInAGame(id: string): boolean {
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

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

}
