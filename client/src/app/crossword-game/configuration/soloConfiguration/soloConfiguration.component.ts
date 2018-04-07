import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";

@Component({
    selector: "app-crossword-game",
    templateUrl: "./soloConfiguration.component.html",
    styleUrls: ["./soloConfiguration.component.css"]
})
export class SoloConfigurationComponent {

    public constructor(private gameState: GameStateService) {
        gameState.difficulty = null;
    }

    public get difficulty(): Difficulty {
        return this.gameState.difficulty;
    }

}
