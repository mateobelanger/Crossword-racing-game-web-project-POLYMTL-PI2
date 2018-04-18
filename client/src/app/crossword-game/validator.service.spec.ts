import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { ValidatorService } from "./validator.service";
import { WordService } from "./word.service";
import { GridWord, Direction } from "../../../../common/crosswordsInterfaces/word";
import { CrosswordGame } from "../../../../common/crosswordsInterfaces/crosswordGame";
import { SocketService } from "./socket.service";
import { UserGridService } from "./user-grid.service";
import { Difficulty } from "../../../../common/constants";
import { LobbyService } from "./lobby/lobby.service";
import { APP_BASE_HREF } from "@angular/common";
import { AppModule } from "../app.module";
import { routes } from "../app-routes.module";
import { GameStateService } from "./game-state.service";
import { Router } from "@angular/router";
import { SelectionStateService } from "./selection-state/selection-state.service";
import { SelectionService } from "./selection/selection.service";

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");
const word4: GridWord = new GridWord (1, 0, Direction.HORIZONTAL, "amour", "Michel est notre _____");

const words: GridWord[] = [word1, word2, word3, word4];

const IS_HOST: boolean = true;

const MOCK_STRING: string = "TEST";

const INITIAL_GRID: string[][] = [
    ["s", "", "t", "", "", "", "", "", "", ""],
    ["a", "", "o", "", "", "", "", "", "", ""],
    ["t", "", "m", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""],
    [ "", "",  "", "", "", "", "", "", "", ""]
];
const FILLED_GRID: string[][] = [
    ["s", "i", "t", "", "", "", "", "", "", ""],
    ["a", "m", "o", "", "", "", "", "", "", ""],
    ["t", "a", "m", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""],
    [ "",  "",  "", "", "", "", "", "", "", ""]
];

describe("ValidatorService", () => {
    let filledGrid: string[][];
    let initialGrid: string[][];
    let wordService: WordService;
    let socketService: SocketService;
    let userGridService: UserGridService;

    let lobbyService: LobbyService;
    let gameStateService: GameStateService;
    let router: Router;
    let selectionStateService: SelectionStateService;

    let selectionService: SelectionService;

    let validatorService: ValidatorService;
    let validatedWords: GridWord[];
    let game: CrosswordGame;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule, HttpClientModule],
            providers: [{provide: APP_BASE_HREF, useValue : "/" }, ValidatorService, WordService, UserGridService,
                        SocketService, LobbyService]
        });
        wordService = TestBed.get(WordService);
        wordService["_words"] = words;

        validatedWords = [word2, word3];

        game = new CrosswordGame(MOCK_STRING, MOCK_STRING, MOCK_STRING, Difficulty.EASY, words);
        game.hostValidatedWords = validatedWords;

        lobbyService = TestBed.get(LobbyService);
        gameStateService = TestBed.get(GameStateService);
        router = TestBed.get(Router);
        selectionStateService = TestBed.get(SelectionStateService);
        socketService = new SocketService(lobbyService, wordService, gameStateService, router, selectionStateService);
        socketService.game = game;

        initialGrid = INITIAL_GRID;
        filledGrid = FILLED_GRID;

        userGridService = TestBed.get(UserGridService);
        userGridService.userGrid = initialGrid;

        selectionService = TestBed.get(SelectionService);
        validatorService = new ValidatorService(wordService, socketService, userGridService, selectionService);
        validatorService["_filledGrid"] = filledGrid;
    });

    it("should be created", () => {
        expect(validatorService).toBeTruthy();
    });

    it("should validate a word when it is completed", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedWord(word2)).toBeTruthy();
    });

    it("should not validate a word when it is not completed", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedWord(word1)).toBeFalsy();
    });

    it("should validate the definition of a word when it is completed", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedDefinition(IS_HOST, word2.definition)).toBeTruthy();
    });

    it("should not validate the definition of a word when it not completed", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedDefinition(IS_HOST, word1.definition)).toBeFalsy();
    });

    it("should return true if the cell is validated", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedCell(0, 0)).toBeTruthy();
    });

    it("should return false if the cell is not validated", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedCell(0, 1)).toBeFalsy();
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // Tests to make sure the local grid is updated when the opponent validates a word
    ///////////////////////////////////////////////////////////////////////////////////

    it("should update local grid when a word is validated and not completed locally by the Host", () => {
        socketService.isHost = true;
        socketService.game.hostValidatedWords = [];
        socketService.game.guestValidatedWords = [];
        // Simulation of function addValidatedWord() executed on the server when a word has been validated
        // by either the host or the guest
        socketService.game.guestValidatedWords.push(word4);

        // We initialy expect the grid to not contain the word4
        let isWordInitiallyCompleted: boolean = true;
        for (let i: number = 0; i < word4.value.length; i++) {
            isWordInitiallyCompleted =
                validatorService["userGridService"].userGrid[word4.row][word4.column + i] === word4.value.toString()[i];
            if (!isWordInitiallyCompleted) {
                return;
            }
        }
        expect(isWordInitiallyCompleted).toBeFalsy();

        // updateLocalGrid() is the function called when a cell has been validated
        // After the call to updateLocalGrid we expect the grid to contain the word4
        let isWordCompleted: boolean = true;
        for (let i: number = 0; i < word4.value.length; i++) {
            isWordCompleted = validatorService["userGridService"].userGrid[word4.row][word4.column + i] === word4.value.toString()[i];
            if (!isWordCompleted) {
                return;
            }
        }
        expect(isWordInitiallyCompleted).toBeTruthy();
    });

    it("should update local grid when a word is validated and not completed locally by the Guest", () => {
        socketService.isHost = false;
        socketService.game.hostValidatedWords = [];
        socketService.game.guestValidatedWords = [];
        // Simulation of function addValidatedWord() executed on the server when a word has been validated
        // by either the host or the guest
        socketService.game.hostValidatedWords.push(word4);

        // We initialy expect the grid to not contain the word4
        let isWordInitiallyCompleted: boolean = true;
        for (let i: number = 0; i < word4.value.length; i++) {
            isWordInitiallyCompleted =
                validatorService["userGridService"].userGrid[word4.row][word4.column + i] === word4.value.toString()[i];
            if (!isWordInitiallyCompleted) {
                return;
            }
        }
        expect(isWordInitiallyCompleted).toBeFalsy();

        // updateLocalGrid() is the function called when a cell has been validated
        // After the call to updateLocalGrid we expect the grid to contain the word4
        let isWordCompleted: boolean = true;
        for (let i: number = 0; i < word4.value.length; i++) {
            isWordCompleted = validatorService["userGridService"].userGrid[word4.row][word4.column + i] === word4.value.toString()[i];
            if (!isWordCompleted) {
                return;
            }
        }
        expect(isWordInitiallyCompleted).toBeTruthy();
    });

});
