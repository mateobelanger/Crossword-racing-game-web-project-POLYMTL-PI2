import { TestBed, inject } from "@angular/core/testing";

import { WordService } from "./word.service";
import { Word, Direction } from "../../../../common/word";

const word1: Word = { row: 0, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "sit", definition: "I like to ___ on my chair." };
const word2: Word = { row: 0, column: 0, direction: Direction.VERTICAL, size: 3, value: "sat", definition: "I ___ on a chair." };
const word3: Word = { row: 0, column: 1, direction: Direction.VERTICAL, size: 5, value: "image", definition: "JPEG, PNG, GIF" };
const word4: Word = { row: 0, column: 2, direction: Direction.VERTICAL, size: 3, value: "tom", definition: "__ a la ferme." };
const word5: Word = { row: 1, column: 0, direction: Direction.HORIZONTAL, size: 5, value: "amour", definition: "Michel est notre _____" };
const word6: Word = { row: 2, column: 0, direction: Direction.HORIZONTAL, size: 3, value: "tam", definition: "TAM ___" };

const words: Word[] = [word1, word2, word3, word4, word5, word6];

describe('WordService', () => {

    let wordService: WordService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [WordService]
        });

        wordService = new WordService();
        wordService["words"] = words;

    });

    it("should be created", inject([WordService], (service: WordService) => {
        expect(service).toBeTruthy();
    }));


    it("should return selected word", () => {
      wordService["_selectedWord"] = word1;

      expect(wordService.selectedWord).toBe(word1);
  });



});
