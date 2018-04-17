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
import { SelectionService } from "./selection/selection.service";

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");

const words: GridWord[] = [word1, word2, word3];

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
    let selectionService: SelectionService;
    let wordService: WordService;
    let socketService: SocketService;
    let userGridService: UserGridService;

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

        selectionService = TestBed.get(SelectionService);

        validatedWords = [word2, word3];

        game = new CrosswordGame(MOCK_STRING, MOCK_STRING, MOCK_STRING, Difficulty.EASY, words);
        game.hostValidatedWords = validatedWords;

        socketService = TestBed.get(SocketService);
        socketService.game = game;

        initialGrid = INITIAL_GRID;
        filledGrid = FILLED_GRID;

        socketService = TestBed.get(SocketService);

        validatorService = new ValidatorService(wordService, socketService, userGridService, selectionService);
        validatorService["filledGrid"] = filledGrid;

        userGridService = TestBed.get(UserGridService);
        userGridService.userGrid = initialGrid;
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

    it("should update local grid when a word is validated", () => {
        validatorService.isValidatedCell(1, 0);
        expect(validatorService["userGridService"].userGrid[1][0]).toBe("a");
    });

    it("should update local grid when a new word is validated", () => {
        validatorService["userGridService"].userGrid[0][1] = "i";
        validatorService.isValidatedCell(1, 0);
        expect(validatorService["userGridService"].userGrid[0][1]).toBe("i");
    });

    it("should return true if the host has validated the definition", () => {
        socketService.game.hostValidatedWords.push(word1);
        validatorService.isHostValidatedDefinition(word1.value);
    });

    it("should return true if the guest has validated the definition", () => {
        socketService.game.guestValidatedWords.push(word1);
        validatorService.isGuestValidatedDefinition(word1.value);
    });

    it("should return false if the guest has not validated the definition", () => {
        socketService.game.guestValidatedWords.push(word1);
        socketService.game.hostValidatedWords.push(word2);
        validatorService.isGuestValidatedDefinition(word2.value);
    });
});
