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

describe("SocketService", () => {

    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    let router: Router;
    const selectionState: SelectionStateService = new SelectionStateService();
    const word: GridWord = new GridWord(0, 0, 0, "mot");

    let socketService: SocketService;

    beforeEach(async (done: DoneFn) => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule, HttpClientModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }, WordService,
                        SocketService, LobbyService]
        });
        http =  TestBed.get(HttpClient);
        const gameStateService: GameStateService = new GameStateService();

        // gameStateService = TestBed.get(GameStateService);
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

    it("createGame should make the user wait for an opponent and make him host", inject([SocketService], async (service: SocketService) => {
        await socketService.createGame("barb", Difficulty.EASY);
        expect(socketService["gameStateService"].isWaitingForOpponent).toBe(true);
        expect(socketService.isHost).toBe(true);
    }));

    it("createSoloGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        await socketService.createSoloGame("bob", Difficulty.EASY);
        expect(socketService.isHost).toBe(true);
    }));

    it("joinGame method sould have been called", inject([SocketService], (service: SocketService) => {
        spyOn(socketService, "joinGame");
        socketService.joinGame("game0", "barb");
        expect(socketService.joinGame).toHaveBeenCalled();
    }));

    it("remoteSelectedWord getter should return the right word", inject([SocketService], async (service: SocketService) => {
        selectionState.remoteSelectedWord = word;
        expect(socketService.remoteSelectedWord).toBe(word);
    }));

    it("gameInitialized getter should return the right subject", inject([SocketService], async (service: SocketService) => {
        selectionState.remoteSelectedWord = word;
        expect(socketService.gameInitialized).toEqual(new Subject());
    }));

    it("end of game should be triggered when all words are validated", inject([SocketService], async (service: SocketService) => {
        const aWord: GridWord[] = [new GridWord(0, 0, Direction.HORIZONTAL, "hello", "gudbye")];
        socketService.game._words = aWord;
        socketService.game.validatedWords[PlayerType.HOST].push(aWord[0]);

        expect(socketService.game.areAllWordsValidated).toBeTruthy();
    }));

});
