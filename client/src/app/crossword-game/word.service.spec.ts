import { TestBed, inject } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { WordService } from "./word.service";
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

// tslint:disable: no-magic-numbers

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to . . . on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I . . . on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM . . .");

const words: GridWord[] = [word1, word2, word3, word4];


describe('WordService', () => {

    let wordService: WordService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [WordService]
        });

        wordService.words = words;

    });

    it("should be created", inject([WordService], (service: WordService) => {
        expect(service).toBeTruthy();
    }));


    it("should return the selected word", () => {
        wordService["_selectedWord"] = word1;

        expect(wordService.selectedWord).toBe(word1);
    });

    it("should return the definition of the selected word", () => {
        wordService["_selectedWord"] = word1;

        expect(wordService.definition).toBe(word1.definition);
    });

    it("should return undefined if no word is selected", () => {
        expect(wordService.definition).toBeNull();
    });

    it("should set the definition of the selected word properly", () => {
        wordService["_selectedWord"] = word1;
        wordService.definition = word2.definition;

        expect(wordService.definition).toBe(word2.definition);
    });

    it("should deselect the selected word properly", () => {
        wordService["_selectedWord"] = word1;
        wordService.deselect();

        expect(wordService.selectedWord).toBeNull();
    });

    it("should return all vertical definitions", () => {
        const verticalExpectedDefinitions: string[][] = [];
        verticalExpectedDefinitions[0] = [word2.definition];
        verticalExpectedDefinitions[1] = [word3.definition];

        const verticalDefinitions: string [][] = wordService.getDefinitions(Direction.VERTICAL);

        expect(verticalDefinitions[0][0]).toBe(verticalExpectedDefinitions[0][0]);
        expect(verticalDefinitions[1][0]).toBe(verticalExpectedDefinitions[1][0]);
    });

    it("should return all horizontal definitions", () => {
      const horizontalExpectedDefinitions: string[][] = [];

      horizontalExpectedDefinitions[0] = [word1.definition];
      horizontalExpectedDefinitions[2] = [word4.definition];

      const horizontalDefinitions: string [][] = wordService.getDefinitions(Direction.HORIZONTAL);

      expect(horizontalDefinitions[0][0]).toBe(horizontalExpectedDefinitions[0][0]);
      expect(horizontalDefinitions[2][0]).toBe(horizontalExpectedDefinitions[2][0]);
    });

    it("should select the right horizontal word from the grid coordinates if no word is initially selected", () => {
        wordService.selectWord(0, 0);

        expect(wordService.selectedWord.value).toBe(word1.value);
    });

    it("should select the right vectical word from the grid coordinates if a perpendicular word is initially selected", () => {
        wordService.selectWord(0, 0);
        wordService.selectWord(0, 0);

        expect(wordService.selectedWord.value).toBe(word2.value);
    });

});
