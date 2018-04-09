import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";
import { SocketService } from "../../socket.service";

@Component({
    selector: "app-crossword-game",
    templateUrl: "./soloConfiguration.component.html",
    styleUrls: ["./soloConfiguration.component.css"]
})
export class SoloConfigurationComponent {

    public constructor(private gameState: GameStateService, private socketService: SocketService) {
    }

    public get difficulty(): Difficulty {
        return this.gameState.difficulty;
    }

    public async createGame(): Promise<void> {
        this.gameState.isOngoing = true;
        await this.socketService.createSoloGame("bob", this.difficulty);
    }
}
