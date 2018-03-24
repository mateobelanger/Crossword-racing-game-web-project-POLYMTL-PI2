import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { ValidatorService } from './validator.service';
import { GRID_SIZE } from '../../../../common/constants';

const KEY_BACKSPACE: number = 8;
const KEY_TAB: number = 9;
const KEY_9: number = 57;
const KEY_LEFT_WINDOW: number = 91;
const KEY_QUOTE: number = 222;

const KEY_A: number = 65;
const KEY_Z: number = 90;

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");
const word5: GridWord = new GridWord (1, 0, Direction.HORIZONTAL, "amour", "Michel est notre _____");
const word6: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM ___");

const words: GridWord[] = [word1, word2, word3, word4, word5, word6];

describe('GridService', () => {
    let wordService: WordService;
    let userGrid: string[][];
    let gridService: GridService;
    let validatorService: ValidatorService;
    let validatedWords: GridWord[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [GridService, ValidatorService, WordService]
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

        wordService = TestBed.get(WordService);
        wordService["_words"] = words;

        validatedWords = [word2, word4];
        validatorService = TestBed.get(ValidatorService);
        validatorService["validatedWords"] = validatedWords;

        gridService = TestBed.get(GridService);
        gridService.userGrid = userGrid;

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
        expect(gridService.userGrid[0][3]).toBe("");
    });

    it("should select the right word when a word is selected", () => {
        gridService.selectWord(0, 0);
        expect(wordService.selectedWord.value).toBe(word1.value);
    });

    it("should return true if the selected is the right one", () => {
        wordService["_selectedWord"] = word1;
        expect(gridService.isSelectedWord(0, 0)).toBeTruthy();
    });

    it("should return false if the selected is the not the right one", () => {
        wordService["_selectedWord"] = word5;
        expect(gridService.isSelectedWord(0, 0)).toBeFalsy();
    });

    it("should return false if there is no selected word", () => {
        wordService["_selectedWord"] = null;
        expect(gridService.isSelectedWord(0, 0)).toBeFalsy();
    });

    it("should return the right id", () => {
        wordService["_selectedWord"] = word5;
        expect(gridService.generateId(2, 3)).toBe((GRID_SIZE * 2) + 3);
    });

    it("should initially fill the grid properly", () => {
        gridService.fillGrid();
        expect(gridService.userGrid).toBe(userGrid);
    });
});
