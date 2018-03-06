import { TestBed, inject } from '@angular/core/testing';

import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { ValidatorService } from './validator.service';

/* tslint:disable: no-magic-numbers */

const KEY_TAB: number = 9;
const KEY_9: number = 57;
const KEY_LEFT_WINDOW: number = 91;
const KEY_QUOTE: number = 222;

const KEY_A: number = 65;
const KEY_E: number = 69;
const KEY_G: number = 71;
const KEY_I: number = 73;
const KEY_M: number = 77;
const KEY_Z: number = 90;

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");
const word5: GridWord = new GridWord (1, 0, Direction.HORIZONTAL, "amour", "Michel est notre _____");
const word6: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM ___");

const words: GridWord[] = [word1, word2, word3, word4, word5, word6];



describe('GridService', () => {

    let userGrid: string[][];
    let wordService: WordService;
    let gridService: GridService;
    let validatorService: ValidatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [GridService, ValidatorService, WordService],
      });

      userGrid = [["s", "", "t", "", "", "", "", "", "", ""], ["a", "", "o", "", "", "", "", "", "", ""],
                  ["t", "", "m", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""]];

      wordService = new WordService();
      wordService.words = words;
      validatorService = new ValidatorService(wordService);
      gridService = new GridService(wordService, validatorService);
      gridService.userGrid = userGrid;

    });

    it('should be created', inject([GridService], (service: GridService) => {
      expect(service).toBeTruthy();
    }));


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


    it("should automatically validate a partially filled word when it is selected and completed", () => {
        wordService["_selectedWord"] = word1;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        gridService.keyUp(0, 1);

        expect(validatorService.isValidatedWord(word1)).toBeTruthy();
    });

    it("should automatically validate a partially filled word when it is not selected and completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        gridService.keyUp(0, 1);

        expect(validatorService.isValidatedWord(word1)).toBeTruthy();
    });


    it("should not validate a word when it is selected and not correctly completed", () => {
        wordService["_selectedWord"] = word1;

        gridService.userGrid[0][1] = "m";
        gridService.keyDown(KEY_M, 0, 1);
        gridService.keyUp(0, 1);

        expect(validatorService.isValidatedWord(word1)).toBeFalsy();
    });


    it("should automatically validate a word when it is selected and completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        gridService.keyUp(0, 1);

        gridService.userGrid[1][1] = "m";
        gridService.keyDown(KEY_M, 1, 1);
        gridService.keyUp(1, 1);

        gridService.userGrid[2][1] = "a";
        gridService.keyDown(KEY_A, 2, 1);
        gridService.keyUp(2, 1);

        gridService.userGrid[3][1] = "g";
        gridService.keyDown(KEY_G, 3, 1);
        gridService.keyUp(3, 1);

        gridService.userGrid[4][1] = "e";
        gridService.keyDown(KEY_E, 4, 1);
        gridService.keyUp(4, 1);

        expect(validatorService.isValidatedWord(word3)).toBeTruthy();
    });


    it("should not validate a word if it is selected and not completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        gridService.keyUp(0, 1);

        gridService.userGrid[1][1] = "m";
        gridService.keyDown(KEY_M, 1, 1);
        gridService.keyUp(1, 1);

        gridService.userGrid[2][1] = "a";
        gridService.keyDown(KEY_A, 2, 1);
        gridService.keyUp(2, 1);

        expect(validatorService.isValidatedWord(word3)).toBeFalsy();
    });

});
