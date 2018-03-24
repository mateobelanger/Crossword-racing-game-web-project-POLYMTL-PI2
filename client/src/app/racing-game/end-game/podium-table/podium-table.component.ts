import { Component, Input } from '@angular/core';
import { EndGameService } from '../end-game.service';

@Component({
    selector: 'app-podium-table',
    templateUrl: './podium-table.component.html',
    styleUrls: ['./podium-table.component.css']
})
export class PodiumTableComponent {

    @Input() public playerName: string;
    // TODO: on peut entrer un nom vide en ce moment
    public isPlayerNameEntered: Boolean;


    public constructor(private endGameService: EndGameService) {
        this.isPlayerNameEntered = false;

    }

    public isNewBestTime(): boolean {
        return this.endGameService.isNewBestTime;
    }

    public displayTimeTable(): void {
        this.endGameService.displayTimeTable();
    }

    public displayResultTable(): void {
        this.endGameService.displayResultTable();
    }

    public saveUserName(): void {
        //this.endGameService.updateBestTimes(this.userName);

        this.isPlayerNameEntered = true;
        this.displayTimeTable();
    }
}
