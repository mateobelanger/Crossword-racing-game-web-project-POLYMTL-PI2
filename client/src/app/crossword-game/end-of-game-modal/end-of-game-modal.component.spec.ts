import { TestBed, inject, ComponentFixture } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { APP_BASE_HREF } from "@angular/common";
import { Router } from "@angular/router";

import { AppModule } from "../../app.module";
import { routes } from "../../app-routes.module";
import { SocketService } from "../socket.service";
import { LobbyService } from "../lobby/lobby.service";
import { WordService } from "../word.service";
import { GameStateService } from "../game-state.service";
import { SelectionStateService } from "../selection-state/selection-state.service";
import { EndOfGameModalComponent } from "./end-of-game-modal.component";
import { ValidatorService } from "../validator.service";
import { UserGridService } from "../user-grid.service";
import { SelectionService } from "../selection/selection.service";
import { GridService } from "../grid.service";
import { Difficulty } from "../../../../../common/constants";
import { CrosswordGame } from "../../../../../common/crosswordsInterfaces/crosswordGame";
import { GridWord } from "../../../../../common/crosswordsInterfaces/word";

describe("endOfGameModalComponent", () => {
    let component: EndOfGameModalComponent;
    let fixture: ComponentFixture<EndOfGameModalComponent>;

    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    let router: Router;
    const selectionState: SelectionStateService = new SelectionStateService();

    const gameStateService: GameStateService = new GameStateService();

    let socketService: SocketService;

    beforeEach(async (done: DoneFn) => {

        TestBed.configureTestingModule({
            imports: [routes, AppModule, HttpClientModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }, WordService,
                        SocketService,
                        LobbyService,
                        ValidatorService,
                        SelectionService,
                        GameStateService,
                        SelectionStateService,
                        UserGridService,
                        GridService]
        }).compileComponents().catch( (error: Error) => console.error(error));
        http =  TestBed.get(HttpClient);

        // gameStateService = TestBed.get(GameStateService);
        router =  TestBed.get(Router);

        socketService = new SocketService(lobbyService, wordService, gameStateService, router, selectionState);

        fixture = TestBed.createComponent(EndOfGameModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();

    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("Restart button should start the procedure and call for a new grid", inject([SocketService], (service: SocketService) => {

        socketService.isHost = true;
        const words: GridWord[] = [new GridWord(0, 0, 0, "helda", "oihoih")];
        const game: CrosswordGame = new CrosswordGame("test", "test", "test", Difficulty.EASY, words);
        socketService.game = game;

        // tslint:disable:no-any
        spyOn<any>(socketService, "hostCreateNewGame");

        socketService.restartNewGame(Difficulty.EASY).catch((error: Error) => console.error(error));

        expect(socketService["hostCreateNewGame"]).toHaveBeenCalled();
    }));

});
