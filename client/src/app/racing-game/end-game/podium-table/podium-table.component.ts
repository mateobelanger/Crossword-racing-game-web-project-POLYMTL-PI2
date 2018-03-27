import { Component, Input } from '@angular/core';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-podium-table',
    templateUrl: './podium-table.component.html',
    styleUrls: ['./podium-table.component.css']
})
export class PodiumTableComponent {

    @Input() public playerName: string;

    public constructor(private endGameService: EndGameService) {
        this.playerName = "";
    }

    public isNewBestTime(): boolean {
        return this.endGameService.isFirst;
    }

    public displayTimeTable(): void {
        this.endGameService.displayTimeTable();
    }

    public displayResultTable(): void {
        this.endGameService.displayResultTable();
    }

    public saveUserName(): void {
        if (this.playerName.length !== 0) {
            this.endGameService.updateBestTimes(this.playerName);
            this.displayTimeTable();
        }
    }
}
