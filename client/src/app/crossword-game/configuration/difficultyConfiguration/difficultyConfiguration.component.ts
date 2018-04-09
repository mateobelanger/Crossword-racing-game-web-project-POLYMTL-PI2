import { Component, OnInit } from "@angular/core";
import { GameStateService } from "../../game-state.service";
import { Difficulty } from "../../../../../../common/constants";

@Component({
    selector: "app-configuration",
    templateUrl: "./difficultyConfiguration.component.html",
    styleUrls: ["./difficultyConfiguration.component.css"]
})

export class DifficultyConfigurationComponent implements OnInit {
    public constructor(private gameState: GameStateService) {
    }

    public ngOnInit(): void {
    }

    public set difficulty(difficulty: Difficulty) {
        this.gameState.difficulty = difficulty;
    }

}
