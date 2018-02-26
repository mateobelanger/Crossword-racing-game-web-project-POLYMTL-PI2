import { TestBed, inject } from '@angular/core/testing';

import { Word, Direction } from '../../../../common/word';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { ValidationMediatorService } from './validation-mediator.service';
import { DefinitionsService } from './definitions.service';

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

const word1: Word = { row: 0, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "sit", definition: "I like to ___ on my chair." };
const word2: Word = { row: 0, column: 0, direction: Direction.VERTICAL, size: 3, value: "sat", definition: "I ___ on a chair." };
const word3: Word = { row: 0, column: 1, direction: Direction.VERTICAL, size: 5, value: "image", definition: "JPEG, PNG, GIF" };
const word4: Word = { row: 0, column: 2, direction: Direction.VERTICAL, size: 3, value: "tom", definition: "__ a la ferme." };
const word5: Word = { row: 1, column: 0, direction: Direction.HORIZONTAL, size: 5, value: "amour", definition: "Michel est notre _____" };
const word6: Word = { row: 2, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "tam", definition: "TAM ___" };

const words: Word[] = [word1, word2, word3, word4, word5, word6];

/* tslint:disable: no-magic-numbers */

describe('GridService', () => {

    let userGrid: string[][];
    let validatedCells: boolean[][];
    let wordService: WordService;
    let gridService: GridService;
    let definitionsService: DefinitionsService;
    let validationMediatorService: ValidationMediatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [GridService, WordService],
      });

      userGrid = [["s", "", "t", "", "", "", "", "", "", ""], ["a", "", "o", "", "", "", "", "", "", ""],
                  ["t", "", "m", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""]];

      validatedCells = [[ true, false,  true, false, false, false, false, false, false, false],
                        [ true, false,  true, false, false, false, false, false, false, false],
                        [ true, false,  true, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false],
                        [false, false, false, false, false, false, false, false, false, false]];

      wordService = new WordService();
      wordService["words"] = words;
      gridService = new GridService(wordService);
      gridService.userGrid = userGrid;
      gridService.validatedCells = validatedCells;
      definitionsService = new DefinitionsService(wordService);
      definitionsService.initialize();
      validationMediatorService = new ValidationMediatorService(gridService, definitionsService, wordService);
    });

    it('should be created', inject([GridService], (service: GridService) => {
      expect(service).toBeTruthy();
    }));


    it("should accept letters input from A to Z", () => {
        let inputValid: boolean = true;

        for (let input: number = KEY_A; input <= KEY_Z && inputValid; input++) {
          inputValid = gridService.keyDown(input, 0, 0);
        }
        expect(inputValid).toBeTruthy();
    });

    it("should not accept special characters", () => {
      let inputValid: boolean = false;

      for (let input: number = KEY_TAB; input <= KEY_9 && !inputValid; input++) {
          inputValid = gridService.keyDown(input, 0, 0);
      }
      for (let input: number = KEY_LEFT_WINDOW; input <= KEY_QUOTE && !inputValid; input++) {
          inputValid = gridService.keyDown(input, 0, 0);
      }

      expect(inputValid).toBeFalsy();
    });


    it("should automatically validate a partially filled word when it is selected and completed", () => {
        wordService["_selectedWord"] = word1;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        validationMediatorService.keyUp(KEY_I, 0, 1);

        expect(gridService.isValidatedWord(word1)).toBeTruthy();
    });

    it("should automatically validate a partially filled word when it is not selected and completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        validationMediatorService.keyUp(KEY_I, 0, 1);

        expect(gridService.isValidatedWord(word1)).toBeTruthy();
    });


    it("should not validate a word when it is selected and not correctly completed", () => {
        wordService["_selectedWord"] = word1;

        gridService.userGrid[0][1] = "m";
        gridService.keyDown(KEY_M, 0, 1);
        validationMediatorService.keyUp(KEY_M, 0, 1);

        expect(gridService.isValidatedWord(word1)).toBeFalsy();
    });


    it("should automatically validate a word when it is selected and completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        validationMediatorService.keyUp(KEY_I, 0, 1);

        gridService.userGrid[1][1] = "m";
        gridService.keyDown(KEY_M, 1, 1);
        validationMediatorService.keyUp(KEY_M, 1, 1);

        gridService.userGrid[2][1] = "a";
        gridService.keyDown(KEY_A, 2, 1);
        validationMediatorService.keyUp(KEY_A, 2, 1);

        gridService.userGrid[3][1] = "g";
        gridService.keyDown(KEY_G, 3, 1);
        validationMediatorService.keyUp(KEY_G, 3, 1);

        gridService.userGrid[4][1] = "e";
        gridService.keyDown(KEY_E, 4, 1);
        validationMediatorService.keyUp(KEY_E, 4, 1);

        expect(gridService.isValidatedWord(word3)).toBeTruthy();
    });


    it("should not validate a word if it is selected and not completed", () => {
        wordService["_selectedWord"] = word3;

        gridService.userGrid[0][1] = "i";
        gridService.keyDown(KEY_I, 0, 1);
        validationMediatorService.keyUp(KEY_I, 0, 1);

        gridService.userGrid[1][1] = "m";
        gridService.keyDown(KEY_M, 1, 1);
        validationMediatorService.keyUp(KEY_M, 1, 1);

        gridService.userGrid[2][1] = "a";
        gridService.keyDown(KEY_A, 2, 1);
        validationMediatorService.keyUp(KEY_A, 2, 1);

        expect(gridService.isValidatedWord(word3)).toBeFalsy();
    });

});
