import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { APP_BASE_HREF } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

import { AppModule } from "../app.module";
import { routes } from "../app-routes.module";
import { SocketService } from "./socket.service";
import { LobbyService } from "./lobby/lobby.service";
import { WordService } from "./word.service";
import { GameStateService } from "./game-state.service";
import { SelectionStateService } from "./selection-state/selection-state.service";
import { GridWord, Direction } from "../../../../common/crosswordsInterfaces/word";
import { Difficulty, PlayerType } from "../../../../common/constants";
import { CrosswordGame } from "../../../../common/crosswordsInterfaces/crosswordGame";

const WORD1: GridWord = new GridWord(0, 0, 0, "computer");
const WORD2: GridWord = new GridWord(0, 0, 1, "car");
const WORD3: GridWord = new GridWord(1, 1, 1, "word");

const HOST_ID: string = "hostId";

describe("SocketService", () => {

    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    let router: Router;
    const selectionState: SelectionStateService = new SelectionStateService();
    const word: GridWord = new GridWord(0, 0, 0, "mot");
    let socketService: SocketService;

    const words: GridWord[] = [];
    words.push(WORD1);
    words.push(WORD2);
    words.push(WORD3);

    beforeEach(async (done: DoneFn) => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule, HttpClientModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }, WordService,
                        SocketService, LobbyService]
        });

        const gameStateService: GameStateService = new GameStateService();
        http =  TestBed.get(HttpClient);
        router =  TestBed.get(Router);
        socketService = new SocketService(lobbyService, wordService, gameStateService, router, selectionState);

        done();

    });

    it("should be created", inject([SocketService], async (service: SocketService) => {
        expect(service).toBeTruthy();
    }));

    it("deselectWord method sould have been called", inject([SocketService], (service: SocketService) => {
        spyOn(socketService, "deselectWord");
        socketService.deselectWord(word);
        expect(socketService.deselectWord).toHaveBeenCalled();
    }));

    it("selectWord method sould have been called", inject([SocketService], (service: SocketService) => {
        spyOn(socketService, "selectWord");
        socketService.selectWord(word);
        expect(socketService.selectWord).toHaveBeenCalled();
    }));

    it("createSoloGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        await socketService.createSoloGame("bob", Difficulty.EASY);
        expect(socketService.isHost).toBe(true);
    }));

    it("createGame should make the user wait for an opponent and make him host", inject([SocketService], async (service: SocketService) => {
        await socketService.createGame("barb", Difficulty.EASY);
        expect(socketService["gameStateService"].isWaitingForOpponent).toBe(true);
        expect(socketService.isHost).toBe(true);
    }));

    it("joinGame method sould have been called", inject([SocketService], (service: SocketService) => {
        spyOn(socketService, "joinGame");
        socketService.joinGame("game0", "barb");
        expect(socketService.joinGame).toHaveBeenCalled();
    }));

    it("startGameAfterJoin should initialize words and start a game", inject([SocketService], (service: SocketService) => {

        const game: CrosswordGame = new CrosswordGame("game0", HOST_ID, "hostUsername", Difficulty.EASY, words);
        // simulate this.socket.on(SocketMessage.SENT_GAME_AFTER_JOIN, ...)
        socketService["startGameAfterJoin"](game);
        expect(socketService["gameStateService"].isOngoing).toBe(true);
        expect(socketService["gameStateService"].isMultiplayer).toBe(true);
        expect(socketService["wordService"].words.length).toBe(words.length);
    }));

    it("initializeGame should initialize words and start a game", inject([SocketService], (service: SocketService) => {
        const game: CrosswordGame = new CrosswordGame("game0", HOST_ID, "hostUsername", Difficulty.EASY, words);

        // simulate this.socket.on(SocketMessage.INITIALIZE_GAME, ...)
        socketService["initializeGame"](game);
        expect(socketService["gameStateService"].isOngoing).toBe(true);
        expect(socketService["gameStateService"].isMultiplayer).toBe(game.isMultiplayer());
        expect(socketService["wordService"].words.length).toBe(words.length);
    }));

    it("remoteSelectedWord getter should return the right word", inject([SocketService], async (service: SocketService) => {
        selectionState.remoteSelectedWord = word;
        expect(socketService.remoteSelectedWord).toBe(word);
    }));

    it("gameInitialized getter should return the right subject", inject([SocketService], async (service: SocketService) => {
        selectionState.remoteSelectedWord = word;
        expect(socketService.gameInitialized).toEqual(new Subject());
    }));

    it("end of game should be triggered when all words are validated", inject([SocketService], (service: SocketService) => {
        const aWord: GridWord = new GridWord(0, 0, Direction.HORIZONTAL, "hello", "gudbye");
        const game: CrosswordGame = new CrosswordGame("test", "test", "test", Difficulty.EASY, [aWord]);
        socketService.game = game;
        socketService.game.validatedWords[PlayerType.HOST].push(aWord);

        socketService["updateValidatedWord"](socketService.game);

        expect(socketService["gameStateService"].isEndOfGame).toBe(true);
    }));

    it("updateValidatedWord should sync the local validated words with the game received",
       inject([SocketService], (service: SocketService) => {
        const game: CrosswordGame = new CrosswordGame("test", "test", "test", Difficulty.EASY, words);
        socketService.game = game;

        const expectedValidatedWords: GridWord[][] = [[WORD1, WORD2, WORD3], []];
        game.validatedWords = expectedValidatedWords;

        socketService["updateValidatedWord"](game);

        expect(socketService.game.validatedWords).toEqual(expectedValidatedWords);

    }));

});
