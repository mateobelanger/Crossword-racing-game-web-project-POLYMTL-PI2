import { TestBed, inject } from '@angular/core/testing';

import { ValidationMediatorService } from './validation-mediator.service';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { DefinitionsService } from './definitions.service';
import { Word, Direction } from '../../../../common/word';


// TODO :  PROBLEM WHEN TESTING
/*
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
*/
describe('ValidationMediatorService', () => {
/*
    let userGrid: string[][];
    let validatedCells: boolean[][];
    let wordService: WordService;
    let gridService: GridService;
    let definitionsService: DefinitionsService;
    let validationMediatorService: ValidationMediatorService;

*/
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ValidationMediatorService, GridService, WordService, DefinitionsService]
      });

      /*
      userGrid = [["s", "", "t", "", "", "", "", "", "", ""], ["a", "", "o", "", "", "", "", "", "", ""],
                  ["t", "", "m", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""]];

      validatedCells = [[ true, true,  true, false, false, false, false, false, false, false],
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

    it('should be created', inject([ValidationMediatorService], (service: ValidationMediatorService) => {
      expect(service).toBeTruthy();
    }));


    it("should automatically validate a partially filled word when it is selected and completed", () => {
        /*
        validationMediatorService.updateValidatedDefinitions(word1);
        //expect(gridService.isValidatedWord(word1)).toBeTruthy();
        expect(definitionsService.isValidatedDefinition(word1)).toBeTruthy();
        */

    });

    it("should automatically validate a partially filled word when it is not selected and completed", () => {
       // wordService["_selectedWord"] = word3;


        //expect(gridService.isValidatedWord(word1)).toBeTruthy();
    });


});
