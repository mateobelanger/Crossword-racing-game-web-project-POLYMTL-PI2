import { Component } from "@angular/core";
import { GridService } from "../grid.service";

@Component({
    selector: "app-end-of-game-modal",
    templateUrl: "./end-of-game-modal.component.html",
    styleUrls: ["./end-of-game-modal.component.css"]
})
export class EndOfGameModalComponent {

    public constructor(private gridService: GridService) {
    }

    public isEndOfGame(): boolean {
        return this.gridService.isEndOfGame();
    }

    public restart(): void {
        this.gridService.setEndOfGame(false);
        window.location.reload();
    }

}
