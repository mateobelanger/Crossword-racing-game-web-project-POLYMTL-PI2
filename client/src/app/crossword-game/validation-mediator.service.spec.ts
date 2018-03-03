/*import { TestBed, inject } from '@angular/core/testing';

import { ValidationMediatorService } from './validation-mediator.service';
import { GridService } from './grid.service';
import { WordService } from './word.service';
import { DefinitionsService } from './definitions.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

const word1: GridWord = { row: 0, column: 0, direction: Direction.HORIZONTAL, value: "sit", definition: "I like to ___ on my chair." };
const word2: GridWord = { row: 0, column: 0, direction: Direction.VERTICAL, value: "sat", definition: "I ___ on a chair." };
const word3: GridWord = { row: 0, column: 2, direction: Direction.VERTICAL, value: "tom", definition: "__ a la ferme." };

const words: GridWord[] = [word1, word2, word3];

describe('ValidationMediatorService', () => {

    let userGrid: string[][];
    let validatedCells: boolean[][];
    let wordService: WordService;
    let gridService: GridService;
    let definitionsService: DefinitionsService;
    let validationMediatorService: ValidationMediatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({providers: [ValidationMediatorService, GridService, WordService, DefinitionsService]});

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
      wordService.words = words;
      gridService = new GridService(wordService);
      gridService.userGrid = userGrid;
      gridService.validatedGrid = validatedCells;
      definitionsService = new DefinitionsService(wordService);
      definitionsService.initialize();
      validationMediatorService = new ValidationMediatorService(gridService, definitionsService, wordService);
    });

    it('should be created', inject([ValidationMediatorService], (service: ValidationMediatorService) => {
      expect(service).toBeTruthy();
    }));

    it("should validate the definition of a word when it is selected and completed", () => {
        wordService["_selectedWord"] = word2;
        validationMediatorService.updateValidatedDefinitions(word2);

        expect(definitionsService.isValidatedDefinition(word2)).toBeTruthy();
    });

    it("should validate the definition of a word when it not selected and completed", () => {
      wordService["_selectedWord"] = word1;
      validationMediatorService.updateValidatedDefinitions(word2);

      expect(definitionsService.isValidatedDefinition(word2)).toBeTruthy();
    });

    it("should not validate the definition of a word when it not completed", () => {
      wordService["_selectedWord"] = word1;
      validationMediatorService.updateValidatedDefinitions(word1);

      expect(definitionsService.isValidatedDefinition(word1)).toBeFalsy();
    });

});*/
