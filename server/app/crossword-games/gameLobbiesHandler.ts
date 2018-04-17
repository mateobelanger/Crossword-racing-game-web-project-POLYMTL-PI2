import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { Difficulty } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";
import { castHttpToGridWords } from "../../../common/communication/httpToObjectCasting";

enum GameType { SOLO, MULTIPLAYER, PENDING }

export class GameLobbiesHandler {

    private static _soloGames: CrosswordGame[] = [];
    private static _multiplayerGames: CrosswordGame[] = [];
    private static _pendingGames: CrosswordGame[] = [];

    public static get multiplayerGames(): CrosswordGame[] {
        return GameLobbiesHandler._multiplayerGames;
    }

    public static get pendingGames(): CrosswordGame[] {
        return GameLobbiesHandler._pendingGames;
    }

    public static get numberOfGames(): number {
        return GameLobbiesHandler._soloGames.length + GameLobbiesHandler._multiplayerGames.length + GameLobbiesHandler._pendingGames.length;
    }

    public static createGame(   roomId: string, socketId: string, username: string,
                                difficulty: Difficulty, words: GridWord[], isSolo: boolean): CrosswordGame {
        if (!GameLobbiesHandler.isAlreadyInAGame(socketId)) {
            if (isSolo) {
                return GameLobbiesHandler.createSoloGame(socketId, roomId, username, difficulty, words);
            } else {
                GameLobbiesHandler._pendingGames.push(
                                new CrosswordGame(roomId, socketId, username, difficulty, castHttpToGridWords(words)) );
            }
        }

        return null;
    }

    public static joinGame(roomId: string, socketId: string, guestName: string): CrosswordGame {

        try {
            GameLobbiesHandler._multiplayerGames.push(GameLobbiesHandler.getGame(roomId));
            GameLobbiesHandler.deleteGameWithId(GameLobbiesHandler._pendingGames, roomId);
            const joinedGame: CrosswordGame = GameLobbiesHandler.getGame(roomId);
            joinedGame.updateGuestInformation(socketId, guestName);

            return joinedGame;
        } catch (error) {
            console.error(error);

            return null;
        }
    }

    public static disconnect(socketId: string): void {
        try {
            const gameType: GameType = GameLobbiesHandler.getExistingGameType(socketId);
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

        } catch (error) {
            console.error(error);
        }
    }

    public static isAlreadyInAGame(id: string): boolean {
        try {
            this.getExistingGameType(id);

            return true;
        } catch (error) {
            return false;
        }
    }

    public static getGame(id: string): CrosswordGame {
        try {
            const gameType: GameType = GameLobbiesHandler.getExistingGameType(id);
            const games: CrosswordGame[] = GameLobbiesHandler.getGameList(gameType);

            return games.find((game: CrosswordGame) => game.isInGame(id));
        } catch (error) {
            throw new Error("no game with this id");
        }
    }

    private static createSoloGame(id: string, roomId: string, username: string, difficulty: Difficulty, words: GridWord[]): CrosswordGame {
        const newGame: CrosswordGame =
            new CrosswordGame(roomId, id, username, difficulty, castHttpToGridWords(words));
        GameLobbiesHandler._soloGames.push(newGame);

        return newGame;
    }

    private static deleteGame(id: string): void {
        try {
            const gameType: GameType = GameLobbiesHandler.getExistingGameType(id);
            const games: CrosswordGame[] = GameLobbiesHandler.getGameList(gameType);

            games.splice(games.findIndex((game: CrosswordGame) => game.isInGame(id)));
        } catch (error) {
            console.error(error);
        }
    }

    private static deleteGameWithId(games: CrosswordGame[], id: string): void {
        games.splice(games.findIndex((game: CrosswordGame) => game.isInGame(id)));
    }

    private static getExistingGameType(id: string): GameType {
        if (GameLobbiesHandler._soloGames.find((game: CrosswordGame) => game.isInGame(id)) !== undefined) {
            return GameType.SOLO;
        } else if (GameLobbiesHandler._multiplayerGames.find((game: CrosswordGame) => game.isInGame(id)) !== undefined) {
            return GameType.MULTIPLAYER;
        } else  if (GameLobbiesHandler._pendingGames.find((game: CrosswordGame) => game.isInGame(id)) !== undefined){
            return GameType.PENDING;
        } else {
            throw new Error("id is not in a game");
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
