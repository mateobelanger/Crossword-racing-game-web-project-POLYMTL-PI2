import { Component } from "@angular/core";
import { GameStateService } from "../game-state.service";

const DIFFICULTY_LENGTH: number = 11;

@Component({
    selector: "app-informations",
    templateUrl: "./informations.component.html",
    styleUrls: ["./informations.component.css"]
})
export class InformationsComponent {

    public difficulty: string;

    public constructor(public gameState: GameStateService) {
        this.difficulty = this.gameState.difficulty === null ? "" : this.gameState.difficulty.substring(DIFFICULTY_LENGTH);
    }
}
