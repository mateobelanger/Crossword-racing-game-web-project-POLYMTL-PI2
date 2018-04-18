import { TestBed, inject } from "@angular/core/testing";
import { SelectionStateService } from "./selection-state.service";
import { GridWord, Direction } from "../../../../../common/crosswordsInterfaces/word";

const word1: GridWord = new GridWord (0, 0, Direction.HORIZONTAL, "sit", "I like to ___ on my chair.");
const word2: GridWord = new GridWord (0, 0, Direction.VERTICAL, "sat", "I ___ on a chair.");

describe("SelectionStateService", () => {

    let selectionStateService: SelectionStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionStateService]
        });
        selectionStateService = new SelectionStateService();
    });

    it("should be created", inject([SelectionStateService], (service: SelectionStateService) => {
        expect(service).toBeTruthy();
    }));

    it("should unselect both local and remote selected words", () => {
        selectionStateService.localSelectedWord = word1;
        selectionStateService.remoteSelectedWord = word2;
        selectionStateService.unselectWords();

        expect(selectionStateService.localSelectedWord).toBeNull();
        expect(selectionStateService.remoteSelectedWord).toBeNull();
    });
});
