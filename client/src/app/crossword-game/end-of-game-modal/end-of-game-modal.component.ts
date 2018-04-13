import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { GameStateService } from "../game-state.service";
import { SocketService } from "../socket.service";
import { ValidatorService } from "../validator.service";

@Component({
    selector: "app-end-of-game-modal",
    templateUrl: "./end-of-game-modal.component.html",
    styleUrls: ["./end-of-game-modal.component.css"]
})
export class EndOfGameModalComponent {

    public isWaitingForOpponent: boolean;

    public constructor(private gridService: GridService,
                       private gameState: GameStateService,
                       private socketService: SocketService,
                       public validator: ValidatorService) {
        this.isWaitingForOpponent = false;
    }

    public isEndOfGame(): boolean {
        return this.gameState._isEndOfGame;
    }

    public isVictorious(): boolean {
        if (this.gameState.isMultiplayer) {
            return this.socketService.isHost ? this.gameState.hostScore > this.gameState.guestScore :
                                           this.gameState.guestScore > this.gameState.hostScore;
        } else {
            return true;
        }
    }

    public restart(): void {
        this.isWaitingForOpponent = true;
        this.gameState._isEndOfGame = false;
        this.gameState.waitForGame();
        this.socketService.restartNewGame(this.gameState.difficulty);

        this.socketService.gameInitialized.subscribe(() => {
            console.log("AAAAAAAAAAAAAAA");
            this.gameState.resetGameState();
            this.validator.initialize();
            this.gridService.initialize();
            this.isWaitingForOpponent = false;
        });
    }

}
