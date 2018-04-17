import { TestBed, inject } from "@angular/core/testing";

import { DefinitionsService } from "./definitions.service";
import { WordService } from "../word.service";
import { GridWord, Direction } from "../../../../../common/crosswordsInterfaces/word";
import { HttpClient, HttpClientModule, HttpHandler } from "@angular/common/http";

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (0, 2, Direction.VERTICAL, "tom", "__ a la ferme.");
const word5: GridWord = new GridWord (1, 0, Direction.HORIZONTAL, "amour", "Michel est notre _____");
const word6: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM ___");

const words: GridWord[] = [word1, word2, word3, word4, word5, word6];

describe("DefinitionsService", () => {

    let wordService: WordService;
    let http: HttpClient;
    let definitionsService: DefinitionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DefinitionsService, WordService, HttpClientModule, HttpClient, HttpHandler]
        });

        http =  TestBed.get(HttpClient);

        wordService = new WordService(http);
        wordService["_words"] = words;

        definitionsService = new DefinitionsService(wordService);
    });

    it("should be created", inject([DefinitionsService], (service: DefinitionsService) => {
        expect(service).toBeTruthy();
    }));

    it("should initialize definitions properly", () => {
        definitionsService.initialize();
        expect(definitionsService.horizontalDefinitions).toEqual(wordService.getDefinitions(Direction.HORIZONTAL));
        expect(definitionsService.verticalDefinitions).toEqual(wordService.getDefinitions(Direction.VERTICAL));
    });
});
