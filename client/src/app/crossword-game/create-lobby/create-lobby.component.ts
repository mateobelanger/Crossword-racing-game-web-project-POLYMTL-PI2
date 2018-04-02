import { Component, OnInit } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';

@Component({
    selector: 'app-create-lobby',
    templateUrl: './create-lobby.component.html',
    styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent implements OnInit {

    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
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

}
