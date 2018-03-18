
import { TestBed, inject } from '@angular/core/testing';

import { ValidatorService } from './validator.service';
import { WordService } from './word.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

// tslint:disable: no-magic-numbers

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");

const words: GridWord[] = [word1, word2, word3];

describe('ValidatorService', () => {

    let userGrid: string[][];
    let wordService: WordService;
    let validatorService: ValidatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({providers: [ValidatorService, WordService]});

      userGrid = [["s", "", "t", "", "", "", "", "", "", ""],
                  ["a", "", "o", "", "", "", "", "", "", ""],
                  ["t", "", "m", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""],
                  [ "", "",  "", "", "", "", "", "", "", ""]];

      wordService = new WordService();
      wordService.words = words;
      validatorService = new ValidatorService(wordService);
    });

    it('should be created', inject([ValidatorService], (service: ValidatorService) => {
      expect(service).toBeTruthy();
    }));

    it("should validate the definition of a word when it is selected and completed", () => {
        wordService["_selectedWord"] = word2;
        validatorService.updateValidatedWords(userGrid);

        expect(validatorService.isValidatedDefinition(word2.definition)).toBeTruthy();
    });

    it("should validate the definition of a word when it not selected and completed", () => {
      wordService["_selectedWord"] = word1;
      validatorService.updateValidatedWords(userGrid);

      expect(validatorService.isValidatedDefinition(word2.definition)).toBeTruthy();
    });

    it("should not validate the definition of a word when it not completed", () => {
      wordService["_selectedWord"] = word1;
      validatorService.updateValidatedWords(userGrid);

      expect(validatorService.isValidatedDefinition(word1.definition)).toBeFalsy();
    });

});
