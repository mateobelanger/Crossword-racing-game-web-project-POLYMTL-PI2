import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ValidatorService } from './validator.service';
import { WordService } from './word.service';
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");

const words: GridWord[] = [word1, word2, word3];

describe('ValidatorService', () => {
    let filledGrid: string[][];
    let initialGrid: string[][];
    let wordService: WordService;

    let validatorService: ValidatorService;
    let validatedWords: GridWord[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ValidatorService, WordService]
        });
        wordService = TestBed.get(WordService);
        wordService["_words"] = words;

        validatedWords = [word2, word3];
        validatorService = TestBed.get(ValidatorService);
        validatorService["validatedWords"] = validatedWords;

        initialGrid = [
            ["s", "", "t", "", "", "", "", "", "", ""], ["a", "", "o", "", "", "", "", "", "", ""],
            ["t", "", "m", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""],
            [ "", "",  "", "", "", "", "", "", "", ""], [ "", "",  "", "", "", "", "", "", "", ""]
        ];

        filledGrid = [
            ["s", "i", "t", "", "", "", "", "", "", ""], ["a", "m", "o", "", "", "", "", "", "", ""],
            ["t", "a", "m", "", "", "", "", "", "", ""], [ "",  "",  "", "", "", "", "", "", "", ""],
            [ "",  "",  "", "", "", "", "", "", "", ""], [ "",  "",  "", "", "", "", "", "", "", ""],
            [ "",  "",  "", "", "", "", "", "", "", ""], [ "",  "",  "", "", "", "", "", "", "", ""],
            [ "",  "",  "", "", "", "", "", "", "", ""], [ "",  "",  "", "", "", "", "", "", "", ""]
        ];
        validatorService["filledGrid"] = filledGrid;
    });

    it('should be created', () => {
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
        expect(validatorService.isValidatedDefinition(word2.definition)).toBeTruthy();
    });

    it("should not validate the definition of a word when it not completed", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedDefinition(word1.definition)).toBeFalsy();
    });

    it("should return true if the cell is validated", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedCell(0, 0)).toBeTruthy();
    });

    it("should return false if the cell is not validated", () => {
        validatorService.updateValidatedWords(initialGrid);
        expect(validatorService.isValidatedCell(0, 1)).toBeFalsy();
    });

    it("should validate the new valid word", () => {
        validatorService.updateValidatedWords(filledGrid);
        expect(validatorService.isValidatedWord(word1)).toBeTruthy();
    });

});
