import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { GameConfiguration } from "../../../../common/crosswordsInterfaces/gameConfiguration";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty } from "../../../../common/constants";
// import { GridService } from "./grid.service";
import { WordService } from "./word.service";
// import { ValidatorService } from "./validator.service";

import { GridWord } from "../../../../common/crosswordsInterfaces/word";
import { Router } from "@angular/router";
import { GameStateService } from "./game-state.service";


@Injectable()
export class SocketService {

    public socket: SocketIOClient.Socket;
    public game: GameConfiguration;
    public isHost: boolean;
    public _remoteSelectedWord: GridWord;

    // tslint:disable-next-line:max-func-body-length
    public constructor( private lobbyService: LobbyService, public wordService: WordService,
                        private gameStateService: GameStateService, private router: Router) {
        this.game = null;
        this._remoteSelectedWord = null;
        this.socket = io.connect("http://localhost:3000");

        this.socket.on("gameLobbies", (waitingGames: GameConfiguration[], ongoingGames: GameConfiguration[]) => {
            this.lobbyService.updateGameLists(ongoingGames, waitingGames);
        });

        this.socket.on("gridFromJoin", (game: GameConfiguration) => {
            console.log("gridJoin");
            this.gameStateService.setMultiplayerGameInfo(game.difficulty, game.hostUsername, game.guestUsername);
            this.initializeGridFromJoin(game);
        });

        this.socket.on("updateValidatedWord", (game: GameConfiguration) => {
            this.game = this.castGame(game);
            console.log("Validated host and guest: ");
            console.log(this.game.hostValidatedWords); console.log(this.game.guestValidatedwords);

            this.gameStateService.updateScores(this.game.hostValidatedWords.length, this.game.guestValidatedwords.length);
        });

        this.socket.on("initializeGame", (game: GameConfiguration) => {
            this.game = this.castGame(game);
            this.router.navigate(["crossword-game/" + this.game.difficulty + "/ui"]);
            this.gameStateService.setMultiplayerGameInfo(game.difficulty, game.hostUsername, game.guestUsername);
        });

        this.socket.on("remoteSelectedWord", (selectedWord: GridWord) => {
            this._remoteSelectedWord = this.castHttpToGridWord([selectedWord])[0];
        });

        this.socket.on("disconnected", (game: GameConfiguration) => {
            console.log("socket disconnected");
        });

    }

    public get remoteSelectedWord(): GridWord {
        return this._remoteSelectedWord;
    }

    public castGame(game: GameConfiguration): GameConfiguration {
        const words: GridWord[] = this.castHttpToGridWord(game._words);
        const hostValidatedWords: GridWord[] = this.castHttpToGridWord(game.hostValidatedWords);
        const guestValidatedwords: GridWord[] = this.castHttpToGridWord(game.guestValidatedwords);
        const castedGame: GameConfiguration = new GameConfiguration(game.roomId, game.hostId, game.hostUsername, game.difficulty, words);

        castedGame.guestValidatedwords = guestValidatedwords;
        castedGame.hostValidatedWords = hostValidatedWords;

        return castedGame;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit("createGame", username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public async createSoloGame(username: string, difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit("create solo game", username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public joinGame(roomId: string, opponentName: string): void {
        this.socket.emit("joinGame", roomId, opponentName);
        this.isHost = false;
    }

    public getGameLobbies(): void {
        this.socket.emit("getGameLobbies");
    }

    public addValidatedWord(word: GridWord): void {
        if (!this.includesWord(word)) {
            this.socket.emit("addValidatedWord", word, this.game.roomId);
        }
    }

    public selectWord(selectedWord: GridWord): void {
        this.socket.emit("selectWord", selectedWord);
    }

    private async createGrid(difficulty: Difficulty): Promise<void> {
        await this.wordService.initialize(difficulty);
    }

    private initializeGridFromJoin(game: GameConfiguration): void {
        this.game = this.castGame(game);
        game._words.forEach((word) => {
            this.wordService.words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        });     // TODO: pourquoi on a besoin de ca? grille ne s'affiche pas si je l'enleve
        this.router.navigate(["crossword-game/" + game.difficulty + "/ui"]);
    }

    private includesWord(wordToFind: GridWord): boolean {
        for (const word of this.game.hostValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }
        for (const word of this.game.guestValidatedwords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }

        return false;
    }
}
