import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";

@Component({
    selector: "app-configuration",
    templateUrl: "./difficultyConfiguration.component.html",
    styleUrls: ["./difficultyConfiguration.component.css"]
})

export class DifficultyConfigurationComponent {
    public constructor(private gameState: GameStateService) {
    }

    public set difficulty(difficulty: Difficulty) {
        this.gameState.difficulty = difficulty;
    }

}
