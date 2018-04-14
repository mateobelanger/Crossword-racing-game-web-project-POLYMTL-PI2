import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { ValidatorService } from './validator.service';
import { GRID_SIZE, Difficulty } from '../../../../common/constants';
import { UserGridService } from './user-grid.service';
import { CrosswordGame } from '../../../../common/crosswordsInterfaces/crosswordGame';
import { SelectionService } from './selection/selection.service';
import { SocketService } from './socket.service';
import { LobbyService } from './lobby/lobby.service';
import { routes } from '../app-routes.module';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { SelectionStateService } from './selection-state/selection-state.service';

const KEY_BACKSPACE: number = 8;
const KEY_TAB: number = 9;
const KEY_9: number = 57;
const KEY_LEFT_WINDOW: number = 91;
const KEY_QUOTE: number = 222;

const KEY_A: number = 65;
const KEY_Z: number = 90;

const MOCK_STRING: string = "TEST";

// tslint:disable:no-magic-numbers
const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");
const word5: GridWord = new GridWord (1, 0, Direction.HORIZONTAL, "amour", "Michel est notre _____");
const word6: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM ___");

const words: GridWord[] = [word1, word2, word3, word4, word5, word6];

describe('GridService', () => {
    let http: HttpClient;
    let socketService: SocketService;
    let wordService: WordService;
    let userGrid: string[][];
    let gridService: GridService;
    let validatorService: ValidatorService;
    let validatedWords: GridWord[];
    let userGridService: UserGridService;
    let game: CrosswordGame;
    let selectionService: SelectionService;
    let selectionState: SelectionStateService;

    // tslint:disable-next-line:max-func-body-length
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule, HttpClientModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }, GridService, ValidatorService, WordService, UserGridService,
                        SelectionService, SocketService, LobbyService]

        });
        userGrid = [
            ["s", "", "t", "q", "", "", "", "", "", ""],
            ["a", "", "o", "", "", "", "", "", "", ""],
            ["t", "", "m",  "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "",  "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "",  "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "",  "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""]
        ];
        http =  TestBed.get(HttpClient);

        validatorService = TestBed.get(ValidatorService);

        wordService = new WordService(http);
        wordService["_words"] = words;

        validatedWords = [word2, word4];
        game = new CrosswordGame(MOCK_STRING, MOCK_STRING, MOCK_STRING, Difficulty.EASY, words);
        game.hostValidatedWords = validatedWords;

        socketService = TestBed.get(SocketService);
        socketService.game = game;

        selectionState = new SelectionStateService();

        selectionService = new SelectionService(wordService, socketService, selectionState);

        userGridService = new UserGridService();
        userGridService.userGrid = userGrid;


        gridService = new GridService(selectionService, wordService, validatorService, userGridService);

    });

    it('should be created', () => {
        expect(gridService).toBeTruthy();
    });

    it("should accept letters input from A to Z", () => {
        let isValidinput: boolean = true;

        for (let input: number = KEY_A; input <= KEY_Z && isValidinput; input++) {
          isValidinput = gridService.keyDown(input, 0, 0);
        }
        expect(isValidinput).toBeTruthy();
    });

    it("should not accept special characters", () => {
        let isValidInput: boolean = false;

        for (let input: number = KEY_TAB; input <= KEY_9 && !isValidInput; input++) {
            isValidInput = gridService.keyDown(input, 0, 0);
        }
        for (let input: number = KEY_LEFT_WINDOW; input <= KEY_QUOTE && !isValidInput; input++) {
            isValidInput = gridService.keyDown(input, 0, 0);
        }

        expect(isValidInput).toBeFalsy();
    });

    it("should make cell empty when backspace is entered", () => {
        gridService.keyDown(KEY_BACKSPACE, 0, 3);
        expect(userGridService.userGrid[0][3]).toBe("");
    });

    it("should select the right word when a word is selected", () => {
        gridService.selectWord(0, 0);
        expect(selectionService.selectedWord.value).toBe(word1.value);
    });

    it("should return false if the selected is the not the right one", () => {
        selectionState.localSelectedWord = word5;
        expect(gridService.selectWord(0, 0)).toBeFalsy();
    });

    it("should return false if there is no selected word", () => {
        selectionState.localSelectedWord = null;
        expect(gridService.selectWord(0, 0)).toBeFalsy();
    });

    it("should return the right id", () => {
        selectionState.localSelectedWord = word5;
        expect(gridService.generateId(2, 3)).toBe((GRID_SIZE * 2) + 3);
    });

    it("should initially fill the grid properly", () => {
        gridService.fillGrid();
        expect(userGridService.userGrid).toBe(userGrid);
    });
});
