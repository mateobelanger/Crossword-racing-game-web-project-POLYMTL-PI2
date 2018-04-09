import { TestBed, inject } from '@angular/core/testing';

import { SelectionService } from './selection.service';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { GridWord, Direction } from '../../../../../common/crosswordsInterfaces/word';
import { WordService } from '../word.service';
import { SocketService } from '../socket.service';


const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to . . . on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I . . . on a chair.");
const word3: GridWord = new GridWord (0, 1, Direction.VERTICAL, "image", "JPEG, PNG, GIF");
const word4: GridWord = new GridWord (2, 0, Direction.HORIZONTAL, "tam", "TAM . . .");

const words: GridWord[] = [word1, word2, word3, word4];

describe('SelectionService', () => {
    let selectionService: SelectionService;
    let wordService: WordService;
    let socketService: SocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        });
        socketService = TestBed.get(SocketService);

        wordService = TestBed.get(WordService);
        wordService.words = words;

        selectionService = new SelectionService(wordService, socketService);
    });

    it('should be created', inject([SelectionService], (service: SelectionService) => {
        expect(service).toBeTruthy();
    }));

    it("should return the selected word", () => {
        selectionService["_selectedWord"] = word1;
        expect(selectionService.selectedWord).toBe(word1);
    });

    it("should return the definition of the selected word", () => {
        selectionService["_selectedWord"] = word1;
        expect(selectionService.definition).toBe(word1.definition);
    });

    it("should return undefined if no word is selected", () => {
        expect(selectionService.definition).toBeNull();
    });

    it("should set the definition of the selected word properly", () => {
        selectionService["_selectedWord"] = word1;
        selectionService.definition = word2.definition;
        expect(selectionService.definition).toBe(word2.definition);
    });

    it("should deselect the selected word properly", () => {
        selectionService["_selectedWord"] = word1;
        selectionService.deselect();
        expect(selectionService.selectedWord).toBeNull();
    });

    it("should select the right horizontal word from the grid coordinates if no word is initially selected", () => {
        selectionService.selectWord(0, 0);
        expect(selectionService.selectedWord.value).toBe(word1.value);
    });

    it("should select the right vectical word from the grid coordinates if a perpendicular word is initially selected", () => {
        selectionService.selectWord(0, 0);
        selectionService.selectWord(0, 0);
        expect(selectionService.selectedWord.value).toBe(word2.value);
    });


});
