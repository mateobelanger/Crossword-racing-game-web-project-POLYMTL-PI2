import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { GameConfiguration } from "../../../../common/crosswordsInterfaces/gameConfiguration";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty, SocketMessage } from "../../../../common/constants";
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

    public constructor( private lobbyService: LobbyService, public wordService: WordService,
                        private gameStateService: GameStateService, private router: Router) {
        this.game = null;
        this._remoteSelectedWord = null;
        this.socket = io.connect("http://localhost:3000");

        this.initializeSocketGameManager();
        this.initializeSocketGameProgression();
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

    private initializeSocketGameManager(): void {

        this.socket.on(SocketMessage.GAME_LOBBIES, (waitingGames: GameConfiguration[], ongoingGames: GameConfiguration[]) => {
            this.lobbyService.onlineGames = ongoingGames;
            this.lobbyService.waitingGames = waitingGames;
        });

        this.socket.on(SocketMessage.INITIALIZE_GAME, (game: GameConfiguration) => {
            this.initializeGame(game);
        });

        this.socket.on(SocketMessage.GRID_FROM_JOIN, (game: GameConfiguration) => {
            this.gridFromJoin(game);
        });

        this.socket.on(SocketMessage.DISCONNECTED, (game: GameConfiguration) => {
            console.log("socket disconnected");
        });
    }

    private initializeSocketGameProgression(): void {

        this.socket.on(SocketMessage.UPDATE_VALIDATED_WORD, (game: GameConfiguration) => {
            this.updateValidatedWord(game);
        });

        this.socket.on(SocketMessage.REMOTE_SELECTED_WORD, (selectedWord: GridWord) => {
            this._remoteSelectedWord = selectedWord === null ?
                this._remoteSelectedWord = null :
                this._remoteSelectedWord = this.castHttpToGridWord([selectedWord])[0];
        });
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
        this.socket.emit(SocketMessage.CREATE_GAME, username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public async createSoloGame(username: string, difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit(SocketMessage.CREATE_SOLO_GAME, username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public joinGame(roomId: string, opponentName: string): void {
        this.socket.emit(SocketMessage.JOIN_GAME, roomId, opponentName);
        this.isHost = false;
    }

    public getGameLobbies(): void {
        this.socket.emit(SocketMessage.GET_GAME_LOBBIES);
    }

    public addValidatedWord(word: GridWord): void {
        this.socket.emit(SocketMessage.ADD_VALIDATED_WORD, word, this.game.roomId);
    }

    public selectWord(selectedWord: GridWord): void {
        this.socket.emit(SocketMessage.SELECT_WORD, selectedWord);
    }

    private async createGrid(difficulty: Difficulty): Promise<void> {
        await this.wordService.initialize(difficulty);
    }

    private initializeGridFromJoin(game: GameConfiguration): void {
        this.game = this.castGame(game);
        game._words.forEach((word) => {
            this.wordService.words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        });
        this.router.navigate(["crossword-game/" + game.difficulty + "/ui"]);

    }

    private gridFromJoin(game: GameConfiguration): void {
        this.gameStateService.difficulty = game.difficulty;
        this.gameStateService.hostName = game.hostUsername;
        this.gameStateService.hostName = game.hostUsername;
        this.gameStateService.startGame();
        this.initializeGridFromJoin(game);
    }

    private updateValidatedWord(game: GameConfiguration): void {
        this.game = this.castGame(game);
        this.gameStateService.hostScore = this.game.hostValidatedWords.length;
        this.gameStateService.guestScore = this.game.guestValidatedwords.length;
    }

    private initializeGame(game: GameConfiguration): void {
        this.game = this.castGame(game);
        this.router.navigate(["crossword-game/" + this.game.difficulty + "/ui"]);
        this.gameStateService.guestName = game.guestUserName;
        this.gameStateService.startGame();
    }

}
