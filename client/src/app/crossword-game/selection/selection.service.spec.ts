import { TestBed, inject } from "@angular/core/testing";

import { SelectionService } from "./selection.service";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { GridWord, Direction } from "../../../../../common/crosswordsInterfaces/word";
import { WordService } from "../word.service";
import { SocketService } from "../socket.service";
import { SelectionStateService } from "../selection-state/selection-state.service";
import { GameStateService } from "../game-state.service";
import { LobbyService } from "../lobby/lobby.service";
import { Router } from "@angular/router";

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to . . . on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I . . . on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM . . .");

const words: GridWord[] = [word1, word2, word3, word4];

describe("SelectionService", () => {
    let selectionService: SelectionService;
    let wordService: WordService;
    let socketService: SocketService;
    let selectionState: SelectionStateService;
    let lobbyService: LobbyService;
    let gameStateService: GameStateService;
    let router: Router;
    let selectionStateService: SelectionStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        });

        lobbyService = TestBed.get(LobbyService);
        gameStateService = TestBed.get(GameStateService);
        router = TestBed.get(Router);
        selectionStateService = TestBed.get(SelectionStateService);
        socketService = new SocketService(lobbyService, wordService, gameStateService, router, selectionStateService);

        wordService = TestBed.get(WordService);
        wordService.words = words;

        selectionState = new SelectionStateService();

        selectionService = new SelectionService(wordService, socketService, selectionState);
    });

    it("should be created", inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));

    it("should return the selected word", () => {
        selectionState.localSelectedWord = word1;
        expect(selectionService.selectedWord).toBe(word1);
    });

    it("should return the definition of the selected word", () => {
        selectionState.localSelectedWord = word1;
        expect(selectionService.definition).toBe(word1.definition);
    });

    it("should return undefined if no word is selected", () => {
        expect(selectionService.definition).toBeNull();
    });

    it("should set the definition of the selected word properly", () => {
        selectionState.localSelectedWord = word1;
        selectionService.definition = word2.definition;
        expect(selectionService.definition).toBe(word2.definition);
    });

    it("should deselect the selected word properly", () => {
        selectionState.localSelectedWord = word1;
        selectionService.deselect();
        expect(selectionService.selectedWord).toBeNull();
    });

    it("should select the right horizontal word from the grid coordinates if no word is initially selected", () => {
        selectionService.selectWord(0, 0);
        expect(selectionService.selectedWord.value).toBe(word1.value);
    });

    it("should select the right vectical word from the grid coordinates if a perpendicular word is initially selected", () => {
        selectionService.selectWord(0, 0);
        selectionService.selectWord(0, 0);
        expect(selectionService.selectedWord.value).toBe(word2.value);
    });

    it("should return the right selected word if the local user is the host", () => {
        socketService.isHost = true;
        selectionState.localSelectedWord = word1;
        selectionState.remoteSelectedWord = word2;
        expect(selectionService.hostSelectedWord).toEqual(word1);
        expect(selectionService.guestSelectedWord).toEqual(word2);

    });

    it("should return the right remote selected word if the local user is the guest", () => {
        socketService.isHost = false;
        selectionState.localSelectedWord = word1;
        selectionState.remoteSelectedWord = word2;
        expect(selectionService.hostSelectedWord).toEqual(word2);
        expect(selectionService.guestSelectedWord).toEqual(word1);
    });

});
