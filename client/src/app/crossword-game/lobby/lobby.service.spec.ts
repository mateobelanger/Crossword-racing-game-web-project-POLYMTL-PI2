import { TestBed, inject } from "@angular/core/testing";
import { LobbyService } from "./lobby.service";
import { CrosswordGame } from "../../../../../common/crosswordsInterfaces/crosswordGame";
import { Difficulty } from "../../../../../common/constants";
import { GridWord } from "../../../../../common/crosswordsInterfaces/word";

const MOCK_STRING: string = "TEST";

describe("LobbyService", () => {

    const word1: GridWord = new GridWord (0, 0, 0, "sit", "sit");
    const words: GridWord[] = [word1];
    const crosswordGame: CrosswordGame = new CrosswordGame(MOCK_STRING, MOCK_STRING, MOCK_STRING, Difficulty.EASY, words);
    const crosswordGames: CrosswordGame[] = [crosswordGame];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LobbyService]
        });

    });

    it("should be created", inject([LobbyService], (service: LobbyService) => {
        expect(service).toBeTruthy();
    }));

    it("should have no pending or multiplayer games after construction" , inject([LobbyService], (service: LobbyService) => {
        expect(service.pendingGames.length).toBe(0);
        expect(service.multiplayerGames.length).toBe(0);
    }));

    it("should have one pending and one multiplayer games ", inject([LobbyService], (service: LobbyService) => {
        service.updateGameLists(crosswordGames, crosswordGames);
        expect(service.pendingGames.length).toBe(1);
        expect(service.multiplayerGames.length).toBe(1);

    }));

});
