import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { SocketService } from "../../socket.service";

@Component({
    selector: "app-crossword-game",
    templateUrl: "./solo-configuration.component.html",
    styleUrls: ["./solo-configuration.component.css"]
})
export class SoloConfigurationComponent {

    public constructor(private gameState: GameStateService, private socketService: SocketService) {
    }

    public get canStartGame(): boolean {
        return !this.gameState.isOngoing && this.gameState.difficulty !== null;
    }

    public async createGame(): Promise<void> {
        this.gameState.startGame();
        await this.socketService.createSoloGame("Score", this.gameState.difficulty);
    }
}
