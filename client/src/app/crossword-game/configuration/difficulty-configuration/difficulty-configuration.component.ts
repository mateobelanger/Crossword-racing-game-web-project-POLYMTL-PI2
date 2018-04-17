import { Component } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";

@Component({
    selector: "app-configuration",
    templateUrl: "./difficulty-configuration.component.html",
    styleUrls: ["./difficulty-configuration.component.css"]
})

export class DifficultyConfigurationComponent {
    public constructor(private gameState: GameStateService) {
    }

    public set difficulty(difficulty: Difficulty) {
        this.gameState.difficulty = difficulty;
    }

}
