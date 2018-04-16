import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { NameValidator } from "../../../../../../common/nameValidator";
import { SocketService } from "../../socket.service";

@Component({
    selector: "app-create-online-game",
    templateUrl: "./onlineConfiguration.component.html",
    styleUrls: ["./onlineConfiguration.component.css"]
})
export class OnlineConfigurationComponent {

    public isGameCreated: boolean;

    public constructor( private gameState: GameStateService,
                        private socketService: SocketService) {
        this.isGameCreated = false;
    }

    public isValidConfiguration(): boolean {
        return this.gameState.isValidState();
    }

    public async createGame(username: string): Promise<void> {
        this.isGameCreated = true;
        await this.socketService.createGame(username, this.gameState.difficulty);
    }

    public isAlphaNum (keyCode: number): boolean {
        return NameValidator.isAlphaNumerical(keyCode);
    }

}
