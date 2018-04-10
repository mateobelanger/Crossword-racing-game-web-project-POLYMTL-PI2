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
import { SelectionStateService } from "./selection-state/selection-state.service";


@Injectable()
export class SocketService {

    public socket: SocketIOClient.Socket;
    public game: GameConfiguration;
    public isHost: boolean;

    public constructor( private lobbyService: LobbyService, public wordService: WordService,
                        private gameStateService: GameStateService, private router: Router,
                        private selectionState: SelectionStateService) {
        this.game = null;

        this.socket = io.connect("http://localhost:3000");

        this.initializeSocketGameManager();
        this.initializeSocketGameProgression();
    }

    public get remoteSelectedWord(): GridWord {
        return this.selectionState.remoteSelectedWord;
    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        this.selectionState.unselectWords();
        await this.createGrid(difficulty);
        this.socket.emit(SocketMessage.CREATE_GAME, username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public async createSoloGame(username: string, difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit(SocketMessage.CREATE_SOLO_GAME, username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public joinGame(roomId: string, guestName: string): void {
        this.socket.emit(SocketMessage.JOIN_GAME, roomId, guestName);
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

    public deselectWord(word: GridWord): void {
        this.socket.emit(SocketMessage.DESELECT_WORD, word);
    }

    private initializeSocketGameManager(): void {

        this.socket.on(SocketMessage.GAME_LOBBIES, (waitingGames: GameConfiguration[], ongoingGames: GameConfiguration[]) => {
            waitingGames = this.castHttpToArrayOfGames(waitingGames);
            ongoingGames = this.castHttpToArrayOfGames(ongoingGames);
            this.lobbyService.updateGameLists(ongoingGames, waitingGames);
        });

        this.socket.on(SocketMessage.INITIALIZE_GAME, (game: GameConfiguration) => {
            this.initializeGame(game);
        });

        this.socket.on(SocketMessage.GRID_FROM_JOIN, (game: GameConfiguration) => {
            this.gridFromJoin(game);
        });

        this.socket.on(SocketMessage.DISCONNECTED, (game: GameConfiguration) => {
            console.log("socket disconnected");
            this.gameStateService.initializeGameState();
        });
    }

    private initializeSocketGameProgression(): void {

        this.socket.on(SocketMessage.UPDATE_VALIDATED_WORD, (game: GameConfiguration) => {
            this.updateValidatedWord(game);
        });

        this.socket.on(SocketMessage.REMOTE_SELECTED_WORD, (selectedWord: GridWord) => {
            this.selectionState.remoteSelectedWord = this.castHttpToGridWord([selectedWord])[0];
        });

        this.socket.on(SocketMessage.REMOTE_DESELECTED_WORD, (word: GridWord) => {
            if (this.selectionState.localSelectedWord !== null && word.value === this.selectionState.localSelectedWord.value) {
                console.log("ADDDDDDDDDDDDDDDDDDDDDDD");
                this.selectionState.unselectWords();
            } else {
                this.selectionState.remoteSelectedWord = null;
            }
        });
    }

    private castGame(game: GameConfiguration): GameConfiguration {
        const words: GridWord[] = this.castHttpToGridWord(game._words);
        const validatedWords: GridWord[][] = this.castHttpToArrayOfGridWord(game.validatedWords);
        const usernames: string[] = [];
        usernames.push(game.usernames[0]);
        usernames.push(game.usernames[1]);
        const ids: string[] = [];
        ids.push(game.ids[0]);
        ids.push(game.ids[1]);
        const castedGame: GameConfiguration = new GameConfiguration(game.roomId, game.hostId, game.hostUsername, game.difficulty, words);

        castedGame.validatedWords = validatedWords;
        castedGame.usernames = usernames;
        castedGame.ids = ids;

        return castedGame;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    private castHttpToArrayOfGridWord(arrayOfGridWords: GridWord[][]): GridWord[][] {
        const arrayOfWords: GridWord[][] = [];
        for (const words of arrayOfGridWords) {
            arrayOfWords.push(this.castHttpToGridWord(words));
        }

        return arrayOfWords;
    }

    private castHttpToArrayOfGames(gameConfigurations: GameConfiguration[]): GameConfiguration[] {
        const castedGameConfigurations: GameConfiguration[] = [];
        for (const game of gameConfigurations) {
            castedGameConfigurations.push(this.castGame(game));
        }

        return castedGameConfigurations;
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
        this.initializeGridFromJoin(game);
        this.gameStateService.setGameInfo(game.usernames[0], game.usernames[1], game.difficulty, true);
    }

    private updateValidatedWord(game: GameConfiguration): void {
        this.game = this.castGame(game);
        this.gameStateService.updateScores(this.game.hostValidatedWords.length, this.game.guestValidatedWords.length);
    }

    private initializeGame(game: GameConfiguration): void {
        this.game = this.castGame(game);
        this.router.navigate(["crossword-game/" + this.game.difficulty + "/ui"]);
        console.log(this.game.isMultiplayer());
        this.gameStateService.setGameInfo(game.usernames[0], game.usernames[1], game.difficulty, this.game.isMultiplayer());
    }

}
