import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";
import { castHttpToGridWord } from "../../../common/communication/httpToObjectCasting";

enum GameType { SOLO, MULTIPLAYER, PENDING }

export class GameLobbiesHandler {

    private static _soloGames: CrosswordGame[] = [];
    private static _multiplayerGames: CrosswordGame[] = [];
    private static _pendingGames: CrosswordGame[] = [];

    // public constructor() {
    //     GameLobbiesHandler._soloGames = [];
    //     GameLobbiesHandler._multiplayerGames = [];
    //     GameLobbiesHandler._pendingGames = [];
    // }

    public static get multiplayerGames(): CrosswordGame[] {
        return GameLobbiesHandler._multiplayerGames;
    }

    public static get pendingGames(): CrosswordGame[] {
        return GameLobbiesHandler._pendingGames;
    }

    public static get numberOfGames(): number {
        return GameLobbiesHandler._soloGames.length + GameLobbiesHandler._multiplayerGames.length + GameLobbiesHandler._pendingGames.length;
    }

    public static isAlreadyInAGame(id: string): boolean {
        let isInAGame: boolean = false;
        GameLobbiesHandler._soloGames.forEach((game: CrosswordGame) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        GameLobbiesHandler._multiplayerGames.forEach((game: CrosswordGame) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        GameLobbiesHandler._pendingGames.forEach((game: CrosswordGame) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });

        return isInAGame;
    }

    public static createGame(   roomId: string, socketId: string, username: string,
                                difficulty: Difficulty, words: GridWord[], isSolo: boolean): CrosswordGame {
        if (!GameLobbiesHandler.isAlreadyInAGame(socketId)) {
            if (isSolo) {
                return GameLobbiesHandler.createSoloGame(socketId, roomId, username, difficulty, words);
            } else {
                GameLobbiesHandler._pendingGames.push(
                                new CrosswordGame(roomId, socketId, username, difficulty, castHttpToGridWord(words)) );
            }
        }

        return null;
    }

    public static joinGame(roomId: string, socketId: string, guestName: string): CrosswordGame {

        GameLobbiesHandler._multiplayerGames.push(GameLobbiesHandler.getGame(roomId));
        GameLobbiesHandler.deleteGameWithId(GameLobbiesHandler._pendingGames, roomId);
        const joinedGame: CrosswordGame = GameLobbiesHandler.getGame(roomId);
        joinedGame.updateGuestInformation(socketId, guestName);

        return joinedGame;
    }

    public static disconnect(socketId: string): void {
        if (GameLobbiesHandler.isAlreadyInAGame(socketId)) {
            const gameType: GameType = GameLobbiesHandler.getGameType(socketId);
            const game: CrosswordGame = GameLobbiesHandler.getGame(socketId);

            switch (gameType) {
                case GameType.SOLO:
                    this.deleteGameWithId(this.getGameList(gameType), socketId);
                    break;
                case GameType.PENDING:
                    GameLobbiesHandler.deleteGame(game.roomId);
                    break;
                case GameType.MULTIPLAYER:
                default:
                    if (game.isHost(socketId)) {
                        game.hostId = game.guestId;
                    }
                    game.guestId = null;

                    GameLobbiesHandler._soloGames.push(game);
                    GameLobbiesHandler.deleteGameWithId(GameLobbiesHandler._multiplayerGames, socketId);
            }

        }
    }

    public static getGame(id: string): CrosswordGame {
        const gameType: GameType = GameLobbiesHandler.getGameType(id);
        const games: CrosswordGame[] = GameLobbiesHandler.getGameList(gameType);

        return games.find((game: CrosswordGame) => game.isInGame(id));
    }

    private static createSoloGame(id: string, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): CrosswordGame {
        const newGame: CrosswordGame =
            new CrosswordGame(roomId, id, username, difficulty, castHttpToGridWord(words));
        GameLobbiesHandler._soloGames.push(newGame);

        return newGame;
    }

    private static deleteGame(id: string): void {
        const gameType: GameType = GameLobbiesHandler.getGameType(id);
        const games: CrosswordGame[] = GameLobbiesHandler.getGameList(gameType);

        games.splice(games.findIndex((game: CrosswordGame) => game.isInGame(id)));
    }

    private static deleteGameWithId(games: CrosswordGame[], id: string): void {
        games.splice(games.findIndex((game: CrosswordGame) => game.isInGame(id)));
    }

    private static getGameType(id: string): GameType {
        if (GameLobbiesHandler._soloGames.find((game: CrosswordGame) => game.isInGame(id)) !== undefined) {
            return GameType.SOLO;
        } else if (GameLobbiesHandler._multiplayerGames.find((game: CrosswordGame) => game.isInGame(id)) !== undefined) {
            return GameType.MULTIPLAYER;
        } else {
            return GameType.PENDING;
        }
    }

    private static getGameList(gameType: GameType): CrosswordGame[] {
        switch (gameType) {
            case GameType.SOLO:
                return GameLobbiesHandler._soloGames;
            case GameType.PENDING:
                return GameLobbiesHandler._pendingGames;
            default:
                return GameLobbiesHandler._multiplayerGames;
        }
    }

}
