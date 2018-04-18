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
import { GridWord, Direction } from "../../../../../common/crosswordsInterfaces/word";
import { EndOfGameModalComponent } from "./end-of-game-modal.component";
import { ValidatorService } from "../validator.service";
import { UserGridService } from "../user-grid.service";
import { SelectionService } from "../selection/selection.service";
import { GridService } from "../grid.service";
import { PlayerType } from "../../../../../common/constants";

describe("endOfGameModalComponent", () => {
    let component: EndOfGameModalComponent;
    let fixture: ComponentFixture<EndOfGameModalComponent>;

    const lobbyService: LobbyService = new LobbyService();
    let http: HttpClient;
    const wordService: WordService = new WordService(http);
    let router: Router;
    const selectionState: SelectionStateService = new SelectionStateService();

    const userGridService: UserGridService = new UserGridService();
    const selectionStateService: SelectionStateService = new SelectionStateService();
    const gameStateService: GameStateService = new GameStateService();

    let selectionService: SelectionService;
    let socketService: SocketService;
    let validatorService: ValidatorService;

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
        });
        http =  TestBed.get(HttpClient);

        // gameStateService = TestBed.get(GameStateService);
        router =  TestBed.get(Router);

        socketService = new SocketService(lobbyService, wordService, gameStateService, router, selectionState);
        selectionService = new SelectionService(wordService, socketService, selectionStateService);
        validatorService = new ValidatorService(wordService, socketService, userGridService, selectionService);

        fixture = TestBed.createComponent(EndOfGameModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();

    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("end of game should trigger modal", inject([SocketService], (service: SocketService) => {
        socketService["gameStateService"]["isEndOfGame"] = true;

    }));

});
