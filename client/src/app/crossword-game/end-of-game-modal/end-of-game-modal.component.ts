import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { GameStateService } from "../game-state.service";
import { SocketService } from "../socket.service";
import { ValidatorService } from "../validator.service";
import { Router } from "@angular/router";
import { GameState } from "../../../../../common/constants";

@Component({
    selector: "app-end-of-game-modal",
    templateUrl: "./end-of-game-modal.component.html",
    styleUrls: ["./end-of-game-modal.component.css"]
})
export class EndOfGameModalComponent {

    public isWaitingForOpponent: boolean;

    public constructor(public validator: ValidatorService,
                       public router: Router,
                       private gridService: GridService,
                       private gameState: GameStateService,
                       private socketService: SocketService) {
        this.isWaitingForOpponent = false;
    }

    public isEndOfGame(): boolean {
        return this.gameState.isEndOfGame;
    }

    public isVictorious(): boolean {
        if (this.gameState.state = GameState.ONGOING) {
            return this.socketService.isHost ? this.gameState.hostScore > this.gameState.guestScore :
                                           this.gameState.guestScore > this.gameState.hostScore;
        } else {
            return true;
        }
    }


    public returnToMenu(): void {
        this.gameState.isEndOfGame = false;
        this.gameState.state = GameState.NO_GAME;
        this.gameState.isMultiplayer = false;
        this.gameState.isReloading = true;
        this.router.navigate(["/"]);
        window.location.reload();
    }
    public restart(): void {
        this.isWaitingForOpponent = true;
        this.gameState._isEndOfGame = false;
        this.gameState.waitForOpponent();
        this.socketService.restartNewGame(this.gameState.difficulty);

        this.socketService.gameInitialized.subscribe(() => {
            this.gameState.resetGameState();
            this.validator.initialize();
            this.gridService.initialize();
            this.isWaitingForOpponent = false;
        });
    }

}
