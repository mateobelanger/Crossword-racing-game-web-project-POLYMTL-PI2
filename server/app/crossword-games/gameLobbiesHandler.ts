import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../../common/constants";
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

    public createGame(  roomId: string, socketId: string, username: string,
                        difficulty: Difficulty, words: GridWord[], isSolo: boolean): GameConfiguration {
        if (!this.isAlreadyInAGame(socketId)) {
            if (isSolo) {
                return this.createSoloGame(socketId, roomId, username, difficulty, words);
            } else {
                this._pendingGames.push(new GameConfiguration(roomId, socketId, username, difficulty, this.castHttpToGridWord(words)));
            }
        }

        return null;
    }

    public joinGame(roomId: string, socketId: string, guestName: string): GameConfiguration {

        this._multiplayerGames.push(this.getGameById(roomId));
        this.deleteGameWithId(this._pendingGames, roomId);
        const joinedGame: GameConfiguration = this.getGameById(roomId);
        joinedGame.updateGuestInformation(socketId, guestName);

        return joinedGame;
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
                    // TODO : this.socketServer.to(game.hostId).emit(SocketMessage.DISCONNECTED);

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

    public get newRoomIdNumber(): number {
        return this._soloGames.length + this._multiplayerGames.length + this._pendingGames.length;
    }

    public castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    private createSoloGame(id: string, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): GameConfiguration {
        const newGame: GameConfiguration =
            new GameConfiguration(roomId, id, username, difficulty, this.castHttpToGridWord(words));
        this._soloGames.push(newGame);

        return newGame;
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

}
