import { Component, OnInit } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";
import { SocketService } from "../../socket.service";

// import { Router } from "@angular/router";

@Component({
    selector: "app-create-online-game",
    templateUrl: "./onlineConfiguration.component.html",
    styleUrls: ["./onlineConfiguration.component.css"]
})
export class OnlineConfigurationComponent implements OnInit {

    public constructor( private gameState: GameStateService,
                        private socketService: SocketService/*,
                        private router: Router*/ ) {
        this.gameState.difficulty = null;
    }

    public ngOnInit(): void {
        this.gameState.isMultiplayer = true;
    }

    public get difficulty(): Difficulty {
        return this.gameState.difficulty;
    }

    public isValidConfiguration(): boolean {
        return this.gameState.difficulty && this.isValidUsername(this.gameState.hostName);
    }

    public isValidUsername(name: String): boolean {
        return name.length > 0;
    }

    public async createGame(username: string): Promise<void> {
        await this.socketService.createGame(username, this.difficulty);
        // this.router.navigate(["crossword-game/" + this.difficulty + "/ui"]);
    }

}
