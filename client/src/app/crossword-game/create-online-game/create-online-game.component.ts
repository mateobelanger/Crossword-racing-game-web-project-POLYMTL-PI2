import { Component, OnInit } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';
import { SocketService } from "../socket.service";

import { Router } from "@angular/router";

@Component({
    selector: 'app-create-online-game',
    templateUrl: './create-online-game.component.html',
    styleUrls: ['./create-online-game.component.css']
})
export class CreateOnlineGameComponent implements OnInit {

    public constructor( private configurationHandlerService: ConfigurationHandlerService,
                        private socketService: SocketService,
                        private router: Router ) {
        this.configurationHandlerService.difficulty = null;
    }

    public ngOnInit(): void {
        this.configurationHandlerService.isMultiplayer = true;
    }

    public get difficulty(): Difficulty {
        return this.configurationHandlerService.difficulty;
    }

    public isValidConfiguration(): boolean {
        return this.configurationHandlerService.difficulty && this.isValidUsername(this.configurationHandlerService.username);
    }

    public isValidUsername(username: String): boolean {
      return (username.length > 0);
    }

    public async createGame(username: string): Promise<void> {
        await this.socketService.createGame(username, this.difficulty);
        console.log("created");
        this.router.navigate(["crossword-game/" + this.difficulty + "/ui"]);
    }

}
