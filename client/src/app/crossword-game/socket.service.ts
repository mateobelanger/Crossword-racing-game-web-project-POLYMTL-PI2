import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { CrosswordGame } from "../../../../common/crosswordsInterfaces/crosswordGame";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty, SocketMessage, PlayerType } from "../../../../common/constants";
import { WordService } from "./word.service";

import { GridWord } from "../../../../common/crosswordsInterfaces/word";
import { castHttpToGridWords, castHttpToArrayOfGridWords } from "../../../../common/communication/httpToObjectCasting";
import { Router } from "@angular/router";
import { GameStateService } from "./game-state.service";
import { SelectionStateService } from "./selection-state/selection-state.service";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SocketService {

    public socket: SocketIOClient.Socket;
    public game: CrosswordGame;
    public isHost: boolean;
    private _gameInitialized$: Subject<void>;

    public constructor(private lobbyService: LobbyService, public wordService: WordService,
                       private gameStateService: GameStateService, private router: Router,
                       private selectionState: SelectionStateService) {
        this.game = null;

        this.socket = io.connect("http://localhost:3000");

        this.initializeSocketGameManager();
        this.initializeSocketGameProgression();
        this.initializeSocketGameRestart();

        this._gameInitialized$ = new Subject();
    }

    public get gameInitialized(): Subject<void> {
        return this._gameInitialized$;
    }

    public get remoteSelectedWord(): GridWord {
        return this.selectionState.remoteSelectedWord;
    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        this.selectionState.unselectWords();
        await this.createGrid(difficulty);
        this.gameStateService.waitForOpponent();
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

    public async restartNewGame(difficulty: Difficulty): Promise<void> {
        if (this.isHost) {
            this.game.isWaitingForRestart[PlayerType.HOST] = true;
            this.hostCreateNewGame(difficulty).catch((error: Error) => { console.error(error); });
        } else {
            this.game.isWaitingForRestart[PlayerType.GUEST] = true;
            if (this.game.isWaitingForRestart[PlayerType.HOST]) {
                this.hostCreateNewGame(difficulty).catch((error: Error) => { console.error(error); });
            }
            this.socket.emit(SocketMessage.GUEST_RESTART_PENDING, this.game.roomId, this.game.isWaitingForRestart[PlayerType.HOST]);
        }
    }

    private initializeSocketGameManager(): void {

        this.socket.on(SocketMessage.GAME_LOBBIES, (waitingGames: CrosswordGame[], ongoingGames: CrosswordGame[]) => {
            waitingGames = this.castHttpToArrayOfGames(waitingGames);
            ongoingGames = this.castHttpToArrayOfGames(ongoingGames);
            this.lobbyService.updateGameLists(ongoingGames, waitingGames);
        });

        this.socket.on(SocketMessage.INITIALIZE_GAME, (game: CrosswordGame) => {
            this.initializeGame(game);
        });

        this.socket.on(SocketMessage.SENT_GAME_AFTER_JOIN, (game: CrosswordGame) => {
            this.startGameAfterJoin(game);
        });

        this.socket.on(SocketMessage.DISCONNECTED, (game: CrosswordGame) => {
            this.gameStateService.initializeGameState();
        });
    }

    private initializeSocketGameProgression(): void {

        this.socket.on(SocketMessage.UPDATE_VALIDATED_WORD, (game: CrosswordGame) => {
            this.updateValidatedWord(game);
        });

        this.socket.on(SocketMessage.REMOTE_SELECTED_WORD, (selectedWord: GridWord) => {
            this.selectionState.remoteSelectedWord = castHttpToGridWords([selectedWord])[0];
        });

        this.socket.on(SocketMessage.REMOTE_DESELECTED_WORD, (word: GridWord) => {
            if (this.selectionState.localSelectedWord !== null && word.value === this.selectionState.localSelectedWord.value) {
                this.selectionState.unselectWords();
            } else {
                this.selectionState.remoteSelectedWord = null;
            }
        });
    }

    private initializeSocketGameRestart(): void {

        this.socket.on(SocketMessage.HOST_ASKED_FOR_RESTART, (game: CrosswordGame) => {
            this.game.isWaitingForRestart[PlayerType.HOST] = true;
            if (!this.gameStateService.isMultiplayer) { this.initializeGridAfterJoin(game); }
        });

        this.socket.on(SocketMessage.GUEST_ASKED_FOR_RESTART, () => {
            this.game.isWaitingForRestart[PlayerType.GUEST] = true;
        });

        this.socket.on(SocketMessage.OPPONENT_DISCONNECTED, () => {
            this.gameStateService.isMultiplayer = false;
        });

        this.socket.on(SocketMessage.OPPONENT_DISCONNECTED_WHILE_WAITING, () => {
            this.router.navigate(["/"]);
            window.location.reload();
        });
    }

    private castGame(game: CrosswordGame): CrosswordGame {
        const words: GridWord[] = castHttpToGridWords(game._words);
        const validatedWords: GridWord[][] = castHttpToArrayOfGridWords(game.validatedWords);
        const usernames: string[] = [];
        usernames.push(game.usernames[0]);
        usernames.push(game.usernames[1]);
        const ids: string[] = [];
        ids.push(game.ids[0]);
        ids.push(game.ids[1]);
        const castedGame: CrosswordGame = new CrosswordGame(game.roomId, game.hostId, game.hostUsername, game.difficulty, words);

        castedGame.validatedWords = validatedWords;
        castedGame.usernames = usernames;
        castedGame.ids = ids;

        return castedGame;
    }

    private castHttpToArrayOfGames(crosswordGames: CrosswordGame[]): CrosswordGame[] {
        const castedCrosswordGames: CrosswordGame[] = [];
        for (const game of crosswordGames) {
            castedCrosswordGames.push(this.castGame(game));
        }

        return castedCrosswordGames;
    }

    private async createGrid(difficulty: Difficulty): Promise<void> {
        await this.wordService.initialize(difficulty);
    }

    private initializeGridAfterJoin(game: CrosswordGame): void {
        this.game = this.castGame(game);
        this.wordService.words = [];
        game._words.forEach((word) => {
            this.wordService.words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        });
        this.router.navigate(["crossword-game/" + game.difficulty + "/ui"]);
        this._gameInitialized$.next();
    }

    private startGameAfterJoin(game: CrosswordGame): void {
        this.initializeGridAfterJoin(game);
        this.gameStateService.setGameInfo(game.usernames[PlayerType.HOST], game.usernames[PlayerType.GUEST], game.difficulty, true);
    }

    private updateValidatedWord(game: CrosswordGame): void {
        this.game = this.castGame(game);
        this.gameStateService.updateScores(this.game.hostValidatedWords.length, this.game.guestValidatedWords.length);
        if (this.game.areAllWordsValidated()) {
            this.gameStateService.isEndOfGame = true;
        }
    }

    private initializeGame(game: CrosswordGame): void {
        this.game = this.castGame(game);
        this.router.navigate(["crossword-game/" + this.game.difficulty + "/ui"]);
        this.gameStateService.setGameInfo(game.usernames[0], game.usernames[1], game.difficulty, this.game.isMultiplayer());
    }

    private async hostCreateNewGame(difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit(SocketMessage.HOST_RESTART_PENDING, this.game.roomId,
                         this.game.isWaitingForRestart[PlayerType.GUEST], this.wordService.words);
    }
}
