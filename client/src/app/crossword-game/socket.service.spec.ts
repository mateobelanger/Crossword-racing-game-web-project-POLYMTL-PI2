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
import { GridWord } from "../../../../common/crosswordsInterfaces/word";
import { Difficulty } from "../../../../common/constants";

describe("SocketService", () => {

    // tslint:disable:prefer-const
    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    const gameStateService: GameStateService =  new GameStateService();
    let router: Router;
    const selectionState: SelectionStateService = new SelectionStateService();
    const word: GridWord = new GridWord(0, 0, 0, "mot");

    // tslint:disable:prefer-const
    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    const gameStateService: GameStateService =  new GameStateService();
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

    it("createGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        spyOn(socketService, "createGame");
        await socketService.createGame("barb", Difficulty.EASY);
        expect(socketService.createGame).toHaveBeenCalled();
    }));

    it("createGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        spyOn(socketService, "createGame");
        await socketService.createGame("barb", Difficulty.EASY);
        expect(socketService.createGame).toHaveBeenCalled();
    }));

    it("createSoloGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        spyOn(socketService, "createSoloGame");
        await socketService.createSoloGame("bob", Difficulty.EASY);
        expect(socketService.createSoloGame).toHaveBeenCalled();
    }));

    it("joinGame method sould have been called", inject([SocketService], async (service: SocketService) => {
        spyOn(socketService, "joinGame");
        await socketService.joinGame("game0", "barb");
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

});
