import { Component, OnInit } from "@angular/core";
import { GameStateService } from "../../game-state.service";
// import { Difficulty } from "../../../../../../common/constants";
import { SocketService } from "../../socket.service";

// import { Router } from "@angular/router";

@Component({
    selector: "app-create-online-game",
    templateUrl: "./onlineConfiguration.component.html",
    styleUrls: ["./onlineConfiguration.component.css"]
})
export class OnlineConfigurationComponent implements OnInit {

    public isGameCreated: boolean;

    public constructor( private gameState: GameStateService,
                        private socketService: SocketService) {
        this.isGameCreated = false;
    }

    public ngOnInit(): void {
    }


    public isValidConfiguration(): boolean {
        return this.gameState.isValidState();
    }

    public isValidUsername(name: String): boolean {
        return name.length > 0;
    }

    public async createGame(username: string): Promise<void> {
        this.isGameCreated = true;
        await this.socketService.createGame(username, this.gameState.difficulty);
    }

}
