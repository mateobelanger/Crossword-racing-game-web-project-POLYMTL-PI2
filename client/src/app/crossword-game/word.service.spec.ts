import { TestBed, inject } from "@angular/core/testing";

import { WordService } from "./word.service";
import { GridWord, Direction } from '../../../../common/crosswordsInterfaces/word';

const word1: GridWord = {row: 0, column: 0, direction: Direction.HORIZONTAL, value: "sit", definition: "You : ___ on a chair."};
const word2: GridWord = { row: 0, column: 0, direction: Direction.VERTICAL, value: "sat", definition: "I . . . on a chair." };
const word3: GridWord = { row: 0, column: 1, direction: Direction.VERTICAL, value: "image", definition: "JPEG, PNG, GIF" };
const word4: GridWord = { row: 2, column: 0, direction: Direction.HORIZONTAL, value: "tam", definition: "TAM . . ." };

const words: GridWord[] = [word1, word2, word3, word4];

// tslint:disable: no-magic-numbers
describe('WordService', () => {

    let wordService: WordService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [WordService]
        });

        wordService = new WordService();
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
        wordService["_selectedWord"] = word1;
        wordService.selectWord(0, 0);
        wordService.selectWord(0, 0);

        expect(wordService.selectedWord.value).toBe(word2.value);
    });

});
